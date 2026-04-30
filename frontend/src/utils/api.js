export async function sendToBackend(assessment) {

    const finalFeatures = {
      typing_speed: assessment.wpm || 0,
      total_errors: assessment.errors || 0,
      overall_accuracy: assessment.quiz_accuracy || assessment.accuracy || 0,
      cognitive_score: assessment.cognitive_score || 0
    };
  
    console.log("FINAL FEATURES:", finalFeatures);
  
    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finalFeatures)
    });
  
    const data = await res.json();
  
    console.log("ML RESPONSE:", data);
  
    return data;
  }