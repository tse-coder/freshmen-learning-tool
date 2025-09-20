<script lang="ts">
  export let resource;

  // Normalize props depending on resource type
  const isExam = resource.course_id && resource.duration;

  $: id = resource.id;
  $: title = resource.title;
  $: type = resource.type;
  $: description = resource.description ?? "";
  $: courseId = resource.course_id;
  $: duration = resource.duration;
   console.log(courseId)
  $: url = !isExam ? resource.url : null;
  $: thumbnail = !isExam ? resource.thumbnail : null;

  // Destination link
  $: href = isExam
    ? `/course/${courseId}/exam/${id}`
    : type === "video"
    ? `/course/${courseId}/video-player/${id}`
    : url;
</script>

<a
  href={href}
  target={isExam || type === "video" ? "_self" : "_blank"}
  class="group flex flex-col max-w-sm min-w-[220px] rounded-md border border-gray-200 dark:border-gray-700 
         bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm 
         shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
>
  {#if !isExam && thumbnail}
    <!-- Thumbnail for non-exam resources -->
    <div class="relative w-full h-36 overflow-hidden rounded-t-md">
      <img
        src={thumbnail}
        alt={title}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  {/if}

  <div class="flex flex-col flex-1 p-4">
    <h3
      class="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1"
    >
      {title}
    </h3>

    {#if isExam}
      <!-- Exam-specific info -->
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {description}
      </p>
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
        Duration: {duration} min
      </p>
    {:else}
      <!-- General resource info -->
      <p class="text-sm text-gray-600 dark:text-gray-400 capitalize">
        {type}
      </p>
    {/if}
  </div>
</a>
