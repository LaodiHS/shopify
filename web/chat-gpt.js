import axios from "axios";

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

generalFormat: (queryResults) => {
  const prompt = {
    "Product Name": "Product Name: " + queryResults.title,
    "Product Overview": "Product Overview: " + queryResults.description,
    "Target Audience": "Target Audience: " + queryResults.targetAudience,
    "Key Features": "Key Features: " + queryResults.keyFeatures,
    "Technical Specifications":
      "Technical Specifications: " + queryResults.technicalSpecifications,
    "Use Cases": "Use Cases: " + queryResults.useCases,
    "Integration Points":
      "Integration Points: " + queryResults.integrationPoints,
    "Implementation Details":
      "Implementation Details: " + queryResults.implementationDetails,
    "Support and Maintenance":
      "Support and Maintenance: " + queryResults.supportAndMaintenance,
    "Known Issues and Limitations":
      "Known Issues and Limitations: " + queryResults.knownIssuesAndLimitations,
    "Resources and Documentation":
      "Resources and Documentation: " + queryResults.resourcesAndDocumentation,
  };
};

function generateRequirementsList(
  productData,
  includedFocusPoints = [],
  languageAndFormattingOptions = [
    ["introduction", "none"],
    ["tone", "none"],
  ]
) {
  const requirementsDict = {
    formats: {},
    introduction: {
      none: {
        prompt: `Introduce the product ${productData.title}.`,
      },
      overview: {
        prompt: `Provide an overview or background information about the product ${productData.title}.`,
      },
      problemStatement: {
        prompt: `Highlight a problem or need that the ${productData.title} addresses.`,
      },
      valueProposition: {
        prompt: `Explain the unique value proposition of the ${productData.title}.`,
      },
      historicalContext: {
        prompt: `Discuss the historical significance or evolution of the ${productData.title}.`,
      },
      targetAudience: {
        prompt: `Identify the target audience of the ${productData.title}, and their specific needs or preferences.`,
      },
      captivatingStory: {
        prompt: `Share a captivating story or anecdote related to ${productData.title}.`,
      },
      statistics: {
        prompt: `Present relevant statistics or data that highlight the importance of the ${productData.title}.`,
      },
    },
    tone: {
      none: {
        prompt:
          "Choose the general tone for the product's communication, ensuring that it conveys a balanced and appropriate tone for the target audience.",
      },
      formal: {
        prompt:
          "Select a formal tone for the product's communication, focusing on professionalism and precision to establish credibility and authority.",
      },
      informal: {
        prompt:
          "Choose an informal tone for the product's communication, aiming for a relaxed and conversational style that resonates with the target audience.",
      },
      professional: {
        prompt:
          "Select a professional tone for the product's communication, emphasizing expertise, trustworthiness, and a polished manner of expression.",
      },
      casual: {
        prompt:
          "Choose a casual tone for the product's communication, creating a friendly and approachable atmosphere that makes users feel comfortable and at ease.",
      },
      friendly: {
        prompt:
          "Select a friendly tone for the product's communication, emphasizing warmth, empathy, and a welcoming attitude towards users.",
      },
      authoritative: {
        prompt:
          "Choose an authoritative tone for the product's communication, projecting confidence, expertise, and a commanding presence to establish the product's credibility and influence.",
      },
      persuasive: {
        prompt:
          "Select a persuasive tone for the product's communication, using compelling language, logical arguments, and emotional appeals to convince and influence users.",
      },
      assertive: {
        prompt:
          "Choose an assertive tone for the product's communication, expressing confidence, determination, and a strong sense of purpose to leave a lasting impact on users.",
      },
      serious: {
        prompt:
          "Select a serious tone for the product's communication, focusing on conveying gravity, importance, and a no-nonsense approach to address critical matters effectively.",
      },
      playful: {
        prompt:
          "Choose a playful tone for the product's communication, infusing humor, wit, and lightheartedness to create an enjoyable and entertaining user experience.",
      },
      humorous: {
        prompt:
          "Select a humorous tone for the product's communication, aiming to entertain and evoke laughter while effectively conveying the intended message or information.",
      },
      empathetic: {
        prompt:
          "Choose an empathetic tone for the product's communication, demonstrating understanding, compassion, and sensitivity towards users' needs, concerns, or challenges.",
      },
      compassionate: {
        prompt:
          "Select a compassionate tone for the product's communication, showing genuine care, kindness, and a willingness to help users overcome their difficulties or obstacles.",
      },
      confident: {
        prompt:
          "Choose a confident tone for the product's communication, projecting self-assurance, belief in the product's value, and inspiring trust in users.",
      },
      conversational: {
        prompt:
          "Select a conversational tone for the product's communication, using a natural and engaging language style that resembles a friendly conversation with users.",
      },
      inspirational: {
        prompt:
          "Choose an inspirational tone for the product's communication, aiming to motivate, uplift, and instill a sense of purpose or aspiration in users.",
      },
      educational: {
        prompt:
          "Select an educational tone for the product's communication, focusing on informative and instructional content to impart knowledge and help users learn.",
      },
      motivational: {
        prompt:
          "Choose a motivational tone for the product's communication, using encouraging language, positive reinforcement, and inspiring messages to drive users towards their goals.",
      },
      engaging: {
        prompt:
          "Select an engaging tone for the product's communication, aiming to captivate users' attention, stimulate their interest, and maintain their active involvement.",
      },
      energetic: {
        prompt:
          "Choose an energetic tone for the product's communication, conveying enthusiasm, vigor, and a dynamic spirit to create a sense of excitement and vitality.",
      },
      soothing: {
        prompt:
          "Select a soothing tone for the product's communication, focusing on providing a calming and comforting experience that alleviates stress or anxiety for users.",
      },
      direct: {
        prompt:
          "Choose a direct tone for the product's communication, using concise and straightforward language to convey information or instructions efficiently.",
      },
      concise: {
        prompt:
          "Select a concise tone for the product's communication, aiming for brevity, clarity, and the effective conveyance of information with minimal verbosity.",
      },
      warm: {
        prompt:
          "Choose a warm tone for the product's communication, emphasizing a friendly, inviting, and affectionate approach to create a positive emotional connection with users.",
      },
    },
    features: {
      design: {
        prompt: `Highlight the innovative and appealing design features.`,
      },

      functionality: {
        prompt: `Emphasize the practical and functional aspects of the product or idea.`,
      },
      customization: {
        prompt: `Discuss the customization options or personalization features available.`,
      },
      technology: {
        prompt: `Explain the advanced technology or cutting-edge features utilized.`,
      },
      versatility: {
        prompt: `Highlight the versatility and adaptability of the ${productData.product}.`,
      },
      userExperience: {
        prompt: `Focus on the seamless user experience and intuitive interface.`,
      },
      sustainability: {
        prompt: `Highlight the environmentally-friendly and sustainable features.`,
      },

      durability: {
        prompt: `Emphasize the durability and long-lasting quality of the ${productData.product}.`,
      },
    },
    evocative: {
      vividDescriptions: {
        prompt:
          "Incorporate vivid and sensory descriptions to bring the product or idea to life.",
      },
      figurativeLanguage: {
        prompt:
          "Use similes, metaphors, or other figures of speech to create evocative descriptions.",
      },
      storytelling: {
        prompt:
          "Employ storytelling techniques to engage readers and evoke emotions.",
      },
      imagery: {
        prompt:
          "Use descriptive imagery to paint a clear mental picture in the reader's mind.",
      },
      sensoryDetails: {
        prompt:
          "Incorporate sensory details that appeal to sight, sound, touch, taste, and smell.",
      },
      poeticLanguage: {
        prompt:
          "Infuse poetic language and lyrical prose to add beauty and elegance to the descriptions.",
      },
      atmosphere: {
        prompt:
          "Create an atmosphere or mood through descriptive language to set the tone of the article.",
      },
      comparisons: {
        prompt:
          "Make effective comparisons to familiar objects or experiences to enhance understanding.",
      },
    },

    narrative: {
      foreshadowing: {
        prompt:
          "Highlight how the product's features and functionality foreshadow future events or outcomes, providing users with a sense of anticipation and excitement.",
      },
      flashback: {
        prompt:
          "Focus on the product's ability to interrupt the usual sequence of operations, allowing users to revisit and explore past events or memories effortlessly.",
      },
      suspense: {
        prompt:
          "Interpret how the product builds tension and keeps users engaged and curious about the outcome, creating an immersive and thrilling experience.",
      },
      symbolism: {
        prompt:
          "Highlight how the product utilizes symbolic representations through objects, characters, or actions, adding deeper meaning and resonating with users on a profound level.",
      },
      irony: {
        prompt:
          "Interpret how the product presents unexpected outcomes or contrasts, providing users with a delightful and surprising experience that challenges their expectations.",
      },
      metaphor: {
        prompt:
          "Focus on how the product makes vivid and imaginative comparisons between unrelated elements, enabling users to understand complex concepts or ideas more intuitively.",
      },
      simile: {
        prompt:
          "Highlight the product's use of similes to describe its features or functionality in a relatable and understandable way, making it easy for users to grasp its value.",
      },
      allusion: {
        prompt:
          "Interpret how the product references well-known people, events, or works of literature, evoking certain emotions or associations that resonate with users.",
      },
      allegory: {
        prompt:
          "Focus on how the product uses a narrative or story to represent abstract ideas or moral principles, allowing users to engage with deeper meanings and messages.",
      },
      juxtaposition: {
        prompt:
          "Highlight how the product juxtaposes contrasting elements or ideas, emphasizing their differences and creating a sense of tension that captivates users.",
      },
      imagery: {
        prompt:
          "Focus on how the product uses vivid and descriptive language to create mental images and sensory experiences for users, immersing them in a rich and captivating environment.",
      },
      dialogue: {
        prompt:
          "Interpret how the product incorporates meaningful conversations between users or characters, revealing their thoughts, emotions, and relationships, and enhancing the overall user experience.",
      },
      point_of_view: {
        prompt:
          "Highlight the product's unique narrative perspective or point of view, whether it's first-person, third-person limited, or third-person omniscient, providing users with a distinct and engaging storytelling experience.",
      },
      cliffhanger: {
        prompt:
          "Focus on how the product ends each stage or phase with suspenseful or unresolved situations, leaving users wanting more and eager to continue their journey.",
      },
      character_development: {
        prompt:
          "Interpret how the product allows for the progression and growth of characters or user profiles, including their thoughts, actions, and relationships, providing a dynamic and immersive user experience.",
      },
      plot_twist: {
        prompt:
          "Highlight the product's ability to introduce unexpected or surprising changes in the storyline or user journey, challenging users' expectations and keeping them engaged and intrigued.",
      },
      narrative_voice: {
        prompt:
          "Interpret how the product's narrative voice, whether it's from the narrator or the main character, creates a unique style, tone, and personality, enhancing the overall user experience and immersing users in the story.",
      },
      setting: {
        prompt:
          "Highlight how the product's time, place, and environment contribute to the overall mood and atmosphere, creating an immersive and engaging experience for users.",
      },
      motif: {
        prompt:
          "Interpret how the product incorporates recurring elements, images, or themes that hold symbolic significance throughout the user journey, providing users with a cohesive and meaningful experience.",
      },
      prologue_epilogue: {
        prompt:
          "Focus on how the product incorporates an introductory or concluding section, such as a prologue or epilogue, providing users with additional context or insight into the product story and enhancing their overall understanding and engagement.",
      },
    },

    rhetorical: {
      anaphora: {
        prompt:
          "Highlight how the product uses the repetition of the same word or phrase at the beginning of successive clauses or sentences to emphasize key points or concepts, creating a powerful and memorable impact.",
      },
      chiasmus: {
        prompt:
          "Emphasize the product's use of a reversal in the order of words or phrases in successive clauses to create a contrasting effect, capturing users' attention and making a lasting impression.",
      },
      hyperbole: {
        prompt:
          "Convey the product's emphasis and dramatic effect through the use of exaggerated statements, showcasing its unique features and benefits in an attention-grabbing and memorable way.",
      },
      metaphor: {
        prompt:
          "Highlight how the product employs metaphors to create vivid images and convey deeper meanings, enabling users to relate to and understand its value proposition on a deeper level.",
      },
      simile: {
        prompt:
          "Emphasize the product's use of similes to highlight similarities between two different things, making its features or benefits more relatable and easily understandable for users.",
      },
      alliteration: {
        prompt:
          "Highlight the product's use of alliteration, which involves the repetition of the same sound or letter at the beginning of closely connected words, creating a rhythmic and memorable effect that captures users' attention.",
      },
      antithesis: {
        prompt:
          "Emphasize the product's use of antithesis, where contrasting ideas or words are juxtaposed to create a balanced and contrasting effect, showcasing the product's unique qualities and differentiating it from competitors.",
      },
      "rhetorical question": {
        prompt:
          "Convey the product's use of rhetorical questions to engage users and make thought-provoking points, stimulating their thinking and prompting them to consider the product's benefits and advantages.",
      },
      irony: {
        prompt:
          "Highlight the product's use of irony, where words are used to convey a meaning opposite to their literal interpretation, creating a sense of intrigue and making users reflect on the product's underlying message or value.",
      },
      personification: {
        prompt:
          "Emphasize how the product employs personification, attributing human qualities or characteristics to non-human entities or abstract concepts, making the product more relatable and fostering an emotional connection with users.",
      },
      metonymy: {
        prompt:
          "Convey the product's use of metonymy, where a related word or phrase is used to represent something else based on association or proximity, making it easier for users to understand and remember key aspects of the product.",
      },
      onomatopoeia: {
        prompt:
          "Highlight how the product incorporates onomatopoeia, using words that imitate the sounds they represent, creating a sensory experience and making the product more engaging and memorable for users.",
      },
      polysyndeton: {
        prompt:
          "Emphasize the product's use of polysyndeton, the repetition of conjunctions (e.g., 'and', 'or') in close succession, creating a rhythmic and impactful effect that draws users' attention and emphasizes key features or benefits.",
      },
      asyndeton: {
        prompt:
          "Convey the product's use of asyndeton, the omission of conjunctions between words or phrases, creating a concise or rapid effect that highlights the product's efficiency, simplicity, or speed.",
      },
      epistrophe: {
        prompt:
          "Highlight how the product uses the repetition of the same word or phrase at the end of successive clauses or sentences to emphasize key points or concepts, leaving a lasting impression on users and reinforcing the product's message.",
      },
    },
    socialMedia: {
      none: {
        prompt:
          "Choose a target audience that encompasses a general demographic without specific platform preferences.",
      },
      facebook: {
        prompt:
          "Select the target audience for Facebook, focusing on users who engage with content and interactions on this platform.",
      },
      twitter: {
        prompt:
          "Choose the target audience for Twitter, focusing on users who actively participate in discussions and trends on this platform.",
      },
      instagram: {
        prompt:
          "Select the target audience for Instagram, focusing on users who engage with visual content and social interactions on this platform.",
      },
      linkedin: {
        prompt:
          "Choose the target audience for LinkedIn, focusing on professionals and businesses who utilize this platform for networking and career-related purposes.",
      },
      pinterest: {
        prompt:
          "Select the target audience for Pinterest, focusing on users who actively search for and engage with visual content related to various interests and hobbies.",
      },
      snapchat: {
        prompt:
          "Choose the target audience for Snapchat, focusing on users who prefer ephemeral and interactive content experiences on this platform.",
      },
      tiktok: {
        prompt:
          "Select the target audience for TikTok, focusing on users who enjoy short-form videos and participate in trends and challenges on this platform.",
      },
      youtube: {
        prompt:
          "Choose the target audience for YouTube, focusing on users who consume and engage with video content across various topics and genres on this platform.",
      },
      reddit: {
        prompt:
          "Select the target audience for Reddit, focusing on users who actively participate in communities and discussions on this platform.",
      },
      tumblr: {
        prompt:
          "Choose the target audience for Tumblr, focusing on users who enjoy creative expression, multimedia content, and niche interests on this platform.",
      },
      venues: {
        podcast: {
          prompt:
            "Select the target audience for your podcast, focusing on listeners who are interested in the content and topics related to your product.",
        },
        newsletter: {
          prompt:
            "Choose the target audience for your newsletter, focusing on subscribers who are interested in receiving updates, news, and valuable information about your product or industry.",
        },
        forum: {
          prompt:
            "Select the target audience for your forum, focusing on users who actively participate in discussions and seek information or support related to your product or niche.",
        },
        blog: {
          prompt:
            "Choose the target audience for your blog, focusing on readers who are interested in the topics, insights, and resources that revolve around your product or industry.",
        },
        eCommerce: {
          prompt:
            "Select the target audience for your eCommerce platform, focusing on potential customers who are interested in purchasing products or services similar to what your platform offers.",
        },
        event: {
          prompt:
            "Choose the target audience for your event, focusing on individuals who are likely to attend and engage with the activities, presentations, or workshops that showcase your product or industry.",
        },
        students: {
          prompt:
            "Select the target audience for educational content or resources related to your product, focusing on learners who are studying or interested in the specific subject or field that your product relates to.",
        },
      },
      liveEvents: {
        podcast: {
          prompt:
            "Select the target audience for your podcast, focusing on listeners who are interested in the content and topics related to your product.",
        },
        newsletter: {
          prompt:
            "Choose the target audience for your newsletter, focusing on subscribers who are interested in receiving updates, news, and valuable information about your product or industry.",
        },
        forum: {
          prompt:
            "Select the target audience for your forum, focusing on users who actively participate in discussions and seek information or support related to your product or niche.",
        },
        blog: {
          prompt:
            "Choose the target audience for your blog, focusing on readers who are interested in the topics, insights, and resources that revolve around your product or industry.",
        },
        eCommerce: {
          prompt:
            "Select the target audience for your eCommerce platform, focusing on potential customers who are interested in purchasing products or services similar to what your platform offers.",
        },
        event: {
          prompt:
            "Choose the target audience for your event, focusing on individuals who are likely to attend and engage with the activities, presentations, or workshops that showcase your product or industry.",
        },
        students: {
          prompt:
            "Select the target audience for educational content or resources related to your product, focusing on learners who are studying or interested in the specific subject or field that your product relates to.",
        },
      },
    },

    // quality: `Mention the ${variables.quality} materials used`,

    // rhetoricalDevice: `Include a ${variables.rhetoricalDevice} to describe its ${variables.appeal}`,
    // pun: `Incorporate a ${variables.punType} related to ${variables.topic}`,
    // callToAction: `Conclude with a call-to-action to explore ${variables.product} ${variables.category}`,
  };

  const requirements = [];

  // if(includedFocusPoints) {

  //   let str= `Among the various considerations to keep in mind, it's worth mentioning ${Object.values(includedFocusPoints).join(', ')} if it makes sense to do so.`

  // requirements.push(str);
  // }

  // product title ProductData.title
  // product description ProductData.description
  // product images ProductData.images.map(imageData=> imageData.transformedSrc)
  // product variants ProductData.variants productData.variants.map(variantData=> ({ title: variantData.title price: variantData.price}))
  // product options ProductData.options productData.options.map(optionData => ({name: optionData.name, options: optionData.values.join(",") })
  // product collections ProductData.collections productData.collections.map(collectionData=> ({title: collectionData.title, description: collectionData.description}))
  // product tags productData.tags []
  // metafields

  if (languageAndFormattingOptions) {
    for (const [key, value] of languageAndFormattingOptions) {
      if (key === "rhetorical") {
        for (const valueOption of value) {
          requirements.push(requirementsDict[key][valueOption]?.prompt);
        }
        continue;
      }
      requirements.push(requirementsDict[key][value]?.prompt);
    }
  }

  // if(includedFocusPoints){

  // for(const [key, value] of includedFocusPoints) {

  // // if(isArray)

  if (includedFocusPoints) {
    for (const [key, value] of includedFocusPoints) {
      requirements.push(requirementsDict[key][value].prompt);
    }
  }

  return requirements;
}

// console.log('options', languageAndFormattingOptions)

//return requirements;

export async function generateReport({
  productData,
  includedFocusPoints,
  languageAndFormattingOptions,
  requestType,
}) {
  console.log("productData--->", productData);
  console.log("includedFocusPoints---->", includedFocusPoints);
  console.log("languageAndFormattingOptions--->", languageAndFormattingOptions);

  const requirementsList = generateRequirementsList(
    productData,
    includedFocusPoints,
    languageAndFormattingOptions
  );
  console.log("requirementsList--->", requirementsList);
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

  const prompt = generateRequirementsList(
    productData,
    includedFocusPoints,
    languageAndFormattingOptions
  );
  console.log("prompt--->", prompt);
  // Set the headers including the authorization header with your API key
  // const headers = {
  //   `Content-Type`: `application/json`,
  //   'Authorization': `Bearer ${apiKey}`,
  // };

  // const data = {
  //   prompt: prompt,
  //   max_tokens: 600,
  //   temperature: 0.7,
  //   stop: [`\n`],
  //   format: `text`,
  // };

  // // Send the POST request using Axios
  // axios
  //   .post(apiUrl, data, { headers })
  //   .then((response) => {
  //     // Handle the response from ChatGPT
  //     const completion = response.data.choices[0].text;
  //     console.log(`ChatGPT response:`, completion);
  //   })
  //   .catch((error) => {
  //     // Handle any errors that occur
  //     console.error(`Error:`, error);
  //   });

  return prompt;
}
