import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {supabase} from "../supabase/client.js";
import { courses } from "../data/courses.js"; 

// Resolve current folder and set root folder to ../pdf
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootFolder = path.resolve(__dirname, "../pdf");

function sanitizeFileName(fileName) {
  // replace non-ASCII chars with hyphens or nothing
  return fileName
    .normalize("NFKD")          // decompose Unicode chars
    .replace(/[^\x00-\x7F]/g, "-") // replace non-ASCII with hyphen
    .replace(/\s+/g, "_");      // replace spaces with underscores
}

// Upload single PDF
async function uploadFile(courseName, type, file) {
  let storageFolder, dbType;
  if (type === "modules") {
    storageFolder = "modules";
    dbType = "module";
  } else if (type === "shortnotes") {
    storageFolder = "short-notes";
    dbType = "shortNote";
  } else {
    console.warn(`⚠️ Unknown type: ${type}, skipping ${file}`);
    return;
  }

  const storagePathUnsafe = `${storageFolder}/${file}`;
  const storagePath = sanitizeFileName(storagePathUnsafe);
  const title = path.parse(file).name;
  const titleSafe = sanitizeFileName(title);

  console.log(`\nProcessing: ${courseName} | ${type} | ${file}`);

  // Check if file exists in storage
  const { data: fileList, error: listError } = await supabase
    .storage
    .from("course-resources")
    .list(storageFolder, { search: file });

  if (listError) {
    console.error(`❌ Storage check error for ${storagePath}: ${listError.message}`);
    return;
  }

  const fileExists = fileList.some(f => f.name === file);

  // Check DB
  const { data: existing, error: checkError } = await supabase
    .from("resources")
    .select("id")
    .eq("course_id", courses[courseName])
    .eq("title", title)
    .eq("type", dbType)
    .maybeSingle();

  if (checkError) {
    console.error(`❌ DB check error for ${storagePath}: ${checkError.message}`);
    return;
  }

  // Upload file if missing in storage
  if (!fileExists) {
    const filePath = path.join(rootFolder, courseName, type, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found locally: ${filePath}`);
      return;
    }

    const fileBuffer = fs.readFileSync(filePath);

    const { error: uploadError } = await supabase
      .storage
      .from("course-resources")
      .upload(storagePath, fileBuffer, {
        contentType: "application/pdf", // ensure correct browser rendering
        cacheControl: '3600',           // optional
        upsert: false
      });

    if (uploadError) {
      console.error(`❌ Upload failed for ${storagePath}: ${uploadError.message}`);
      console.log(storagePath,fileBuffer);
      return;
    }
    console.log(`✅ Uploaded to storage: ${storagePath}`);
  } else {
    console.log(`📦 Already in storage: ${storagePath}`);
  }

  // Create a signed URL valid for 4 years
  const fourYearsInSeconds = 60 * 60 * 24 * 365 * 4; // 4 years
  const { data: signedData, error: signedError } = await supabase
    .storage
    .from("course-resources")
    .createSignedUrl(storagePath, fourYearsInSeconds);

  if (signedError) {
    console.error(`❌ Failed to create signed URL for ${storagePath}: ${signedError.message}`);
    return;
  }

  const signedUrl = signedData.signedUrl;
  console.log(`🔗 Signed URL (4 years): ${signedUrl}`);

  // Insert DB record if missing
  if (!existing) {
    const { error: dbError } = await supabase.from("resources").insert([
      {
        course_id: courses[courseName],
        title,
        type: dbType,
        url: signedUrl,
        subscription_type: "normal"
      }
    ]);

    if (dbError) {
      console.error(`❌ DB insert failed for ${storagePath}: ${dbError.message}`);
    } else {
      console.log(`🗄️ Inserted into DB: ${storagePath}`);
    }
  } else {
    console.log(`📊 DB record already exists`);
  }
}

// Main loop
async function main() {
  console.log("🚀 Starting resource seeding...");
  console.log(`📂 Root PDF folder: ${rootFolder}`);

  for (const courseName of Object.keys(courses)) {
    const courseFolder = path.join(rootFolder, courseName);
    // if the course folder doesnt exist create one
    if (!fs.existsSync(courseFolder)) {
      fs.mkdirSync(courseFolder);
      console.log(`⚠️ Course folder missing, created: ${courseName}`);
      continue;
    }

    for (const type of ["modules", "shortnotes"]) {
      const typeFolder = path.join(courseFolder, type);
      if (!fs.existsSync(typeFolder)) {
        fs.mkdirSync(typeFolder);
        console.log(`⚠️ Type folder missing, created: ${type} in ${courseName}`);
        continue;
      }

      const files = fs.readdirSync(typeFolder).filter(f => f.endsWith(".pdf"));
      if (files.length === 0) {
        console.log(`ℹ️ No PDFs in ${typeFolder}`);
        continue;
      }

      for (const file of files) {
        await uploadFile(courseName, type, file);
      }
    }
  }

  console.log("\n🎉 Seeding complete!");
}

main();
