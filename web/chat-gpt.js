const axios = require(`axios`);

// Set up the API endpoint URL
const apiUrl = `https://api.openai.com/v1/engines/davinci-codex/completions`;

// Set your OpenAI API key
const apiKey = `YOUR_API_KEY`;

// Set the data payload containing the prompt
//   temperature: Controls the randomness of the generated text. A higher value like 0.8 will produce more random and creative responses, while a lower value like 0.2 will make the output more focused and deterministic.

// max_tokens: Specifies the maximum number of tokens in the generated response. This can be used to limit the length of the output.

// top_p (also known as nucleus sampling): It sets a cumulative probability threshold for the generated tokens. The model will keep adding tokens until the cumulative probability exceeds this threshold. This helps in controlling the diversity of the generated text.

// frequency_penalty: A parameter that can be used to discourage repetitive output. Higher values like 2.0 will make the model less likely to repeat the same phrases, while lower values like 0.2 will make it more likely.

// presence_penalty: This parameter encourages the model to include or avoid certain phrases in the generated text. A higher value like 0.8 will make the model more likely to include provided phrases, and a lower value like 0.2 will make it less likely.

// stop: An array of strings that specifies custom stop sequences. The model will stop generating tokens once any of the stop sequences are encountered.
//   const data = {
//     prompt: `What is the meaning of life?`,
//     max_tokens: 400,
//     temperature: 0.6,
//     //   top_p: 0.3,
//     //   frequency_penalty: 0.3,
//     presence_penalty: 0.3,
//     stop: [`\n`], // Custom stop sequence
//     format: `html`,
//   };



function generateRequirementsList(variables) {



  
    const requirementsDict = {
      introduce: {
        none:`Introduce the ${variables.product}`,
        overview:
          `Provide an overview or background information about the ${variables.product}.`,
        problemStatement:
          `Highlight a problem or need that the ${variables.product} addresses.`,
        valueProposition:
          `Explain the unique value proposition of the ${variables.product}.`,
        historicalContext:
          `Discuss the historical significance or evolution of the ${variables.product}.`,
        targetAudience:
          `Identify the target audience of the ${variables.product}, and their specific needs or preferences.`,
        captivatingStory:
          `Share a captivating story or anecdote related to ${variables.product}.`,
        statistics:
          `Present relevant statistics or data that highlight the importance of the ${variables.product}.`,
      },
      features: {
        design: `Highlight the innovative and appealing design features.`,
        functionality: `Emphasize the practical and functional aspects of the product or idea.`,
        customization: `Discuss the customization options or personalization features available.`,
        technology: `Explain the advanced technology or cutting-edge features utilized.`,
        versatility: `Highlight the versatility and adaptability of the ${variables.product}.`,
        userExperience: `Focus on the seamless user experience and intuitive interface.`,
        sustainability: `Highlight the environmentally-friendly and sustainable features.`,
        durability: `Emphasize the durability and long-lasting quality of the ${variables.product}.`
  },
      quality: `Mention the ${variables.quality} materials used`,
    descriptiveLanguage: {
    vividDescriptions: "Incorporate vivid and sensory descriptions to bring the product or idea to life.",
    figurativeLanguage: "Use similes, metaphors, or other figures of speech to create evocative descriptions.",
    storytelling: "Employ storytelling techniques to engage readers and evoke emotions.",
    imagery: "Use descriptive imagery to paint a clear mental picture in the reader's mind.",
    sensoryDetails: "Incorporate sensory details that appeal to sight, sound, touch, taste, and smell.",
    poeticLanguage: "Infuse poetic language and lyrical prose to add beauty and elegance to the descriptions.",
    atmosphere: "Create an atmosphere or mood through descriptive language to set the tone of the article.",
    comparisons: "Make effective comparisons to familiar objects or experiences to enhance understanding."
  },
      rhetoricalDevice: `Include a ${variables.rhetoricalDevice} to describe its ${variables.appeal}`,
      pun: `Incorporate a ${variables.punType} related to ${variables.topic}`,
      callToAction: `Conclude with a call-to-action to explore ${variables.product} ${variables.category}`,
    };


        const requirements = [];

        for (const [key, value] of Object.entries(requirementsDict)) {
            if (variables[key]) {
                requirements.push(value);
            }
        }

        return requirements;
    
}

export async function generateArticle() {
  // Set the prompt you want to send to ChatGPT

  const variables = {
    product: `trendy leather jacket called Polo`,
    features: `design elements`,
    quality: `premium`,
    rhetoricalDevice: `simile`,
    appeal: `stylish and sophisticated aura`,
    punType: `fashion-related pun`,
    topic: `fashion`,
    category: `jackets`,
  };

  const prompt = generateRequirementsList(product, variables);

  // Set the headers including the authorization header with your API key
  const headers = {
    `Content-Type`: `application/json`,
    Authorization: `Bearer ${apiKey}`,
  };

  const data = {
    prompt: prompt,
    max_tokens: 600,
    temperature: 0.7,
    stop: [`\n`],
    format: `text`,
  };

  // Send the POST request using Axios
  axios
    .post(apiUrl, data, { headers })
    .then((response) => {
      // Handle the response from ChatGPT
      const completion = response.data.choices[0].text;
      console.log(`ChatGPT response:`, completion);
    })
    .catch((error) => {
      // Handle any errors that occur
      console.error(`Error:`, error);
    });
}
