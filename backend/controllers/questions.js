import { supabase } from "../supabase/client.js";

export const getExamQuestions = async(examId) => {
    const { data: examQuestions, error } = await supabase.from("exam_questions").select("*").eq("exam_id",examId);
    if (error) {
        console.error("Error fetching exam questions:", error);
        return [];
    }
    return examQuestions;
};
