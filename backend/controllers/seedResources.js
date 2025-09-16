import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {supabase} from "../supabase/client.js"; // import your pre-configured supabase client

// Course mapping
const courses = {
  "Antropology": "7ed64432-f975-43a4-9f3a-073c42d73aac",
  "Applied Maths I": "867f20d2-a79c-4633-b574-31dd30ca133d",
  "Biology": "0bacb966-b7b9-450e-a19e-f401f02f7cad",
  "Chemistry": "f8ec774a-a8de-4b67-8d4e-b541c44e1755",
  "Civics": "72ada40d-0c61-4f91-8e61-1300d49c2dc4",
  "Economics": "5fc6d5a0-ce49-40c1-a03a-d84a8d12ec41",
  "Emerging Tech": "607da387-25cb-494a-8d9b-d437c932121f",
  "English": "3ddfb605-65da-44bf-aff2-542063fe8e3f",
  "Entrepreneurship": "66b64d50-e056-4238-b04d-5a77afeb11c3",
  "Geography": "4418ca3c-ced0-4e1b-a417-8f3401a4ed8e",
  "Global Trends": "3b6c663f-9392-4ef9-aed9-3fc9b6a866ca",
  "History": "f1bfc9f6-321f-42f6-ac71-be9a0e63c8e9",
  "Inclusiveness": "a82bd5ee-1ed3-470e-b631-c76f8d8ff8e4",
  "Logic": "8d37d61d-816e-44d8-a6c3-36757127c576",
  "Maths (natural)": "c9060dc4-02a2-4961-867f-46ef64f603d2",
  "Maths (social)": "871c5c39-0d31-4bb3-af95-088f234ece5f",
  "Physical Fitness": "ae4fd0cf-cd15-4893-852c-1394512aff3c",
  "Physics": "9f07bd96-0d69-425d-a1c3-4b426e938e06",
  "Psychology": "d8a1af9d-47e3-4844-b0ce-18180b383b12"
};

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
