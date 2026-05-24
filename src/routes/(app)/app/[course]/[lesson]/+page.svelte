<script lang="ts">
	import LessonTemplate from '$lib/components/templates/LessonTemplate.svelte';
	import QuizQuestion from '$lib/components/organisms/QuizQuestion.svelte';

	let { data } = $props();

	const { course, lesson, lessonIndex } = data;
</script>

<svelte:head>
	<title>DMDDA | {lesson.name}</title>
</svelte:head>

<LessonTemplate>
	<QuizQuestion
		questions={lesson.questions}
		backHref="/app/{course.id}"
		courseId={course.id}
		{lessonIndex}
	/>
</LessonTemplate>
