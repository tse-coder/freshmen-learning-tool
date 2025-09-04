<script lang="ts">
  import { onMount } from "svelte";
  // @ts-ignore
  import WebViewer from "@pdftron/pdfjs-express-viewer";

  export let data;
  const { resource } = data;

  let viewerEl: HTMLDivElement;
  let initialized = false; // guard to prevent double init

  onMount(() => {
    if (initialized) return;
    initialized = true;

    WebViewer(
      {
        path: "/pdfjs-express", 
        initialDoc: "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf"
      },
      viewerEl
    ).then((instance: any) => {
      console.log("WebViewer loaded", instance);
    });
  });
</script>

<div bind:this={viewerEl} style="height: 100vh; width: 100%"></div>
