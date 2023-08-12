import { schemePastel2 } from "d3-scale-chromatic";
import { interpolateHsl } from "d3-interpolate";
import chroma from "chroma-js";
import * as D3Node from "d3-node";
const d3 = D3Node.d3;
import pluralize from "pluralize";
// function generatePastelColors(numColors) {
//   if (numColors < 1) {
//     throw new Error("Invalid input parameter.");
//   }

//   const pastelColors = schemePastel2.slice(0, numColors);

//   return pastelColors;
// }
// Example usage:

function getColor() {
  return (
    "hsl(" +
    360 * Math.random() +
    "," +
    (25 + 70 * Math.random()) +
    "%," +
    (85 + 10 * Math.random()) +
    "%)"
  );
}

function generateComplementaryScheme(numColors) {
  numColors = 100;

  const set = new Set();
  for (let i = 0; i < numColors; i++) {
    let hsl = getColor();

    let hex = chroma(hsl).hex();

    set.add(hex);
  }
  return [...set];
}

// Set up the API endpoint URL

// Set the data payload containing the prompt
//   temperature: Controls the randomness of the generated text. A higher value like 0.8 will produce more random and creative responses, while a lower value like 0.2 will make the output more focused and deterministic.

// max_tokens: Specifies the maximum number of tokens in the generated response. This can be used to limit the length of the output.

// top_p (also known as nucleus sampling): It sets a cumulative probability threshold for the generated tokens. The model will keep adding tokens until the cumulative probability exceeds this threshold. This helps in controlling the diversity of the generated text.

// frequency_penalty: A parameter that can be used to discourage repetitive output. Higher values like 2.0 will make the model less likely to repeat the same phrases, while lower values like 0.2 will make it more likely.

// presence_penalty: This parameter encourages the model to include or avoid certain phrases in the generated text. A higher value like 0.8 will make the model more likely to include provided phrases, and a lower value like 0.2 will make it less likely.

// stop: An array of strings that specifies custom stop sequences. The model will stop generating tokens once any of the stop sequences are encountered.
// const apiUrl = `https://api.openai.com/v1/engines/davinci-codex/completions`;

// Set your OpenAI API key

// const data = {
//   prompt: `What is the meaning of life?`,
//   max_tokens: 400,
//   temperature: 0.6,
//   //   top_p: 0.3,
//   //   frequency_penalty: 0.3,
//   presence_penalty: 0.3,
//   stop: [`\n`], // Custom stop sequence
//   format: `html`,
// };

// Set the headers including the authorization header with your API key

// const apiUrl = `https://api.openai.com/v1/chat/completions`;
// const apiKey = `YOUR_API_KEY`;
// const headers = {
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${apiKey}`,
// };

// const data = {
//   prompt: prompt,
//   max_tokens: 600,
//   temperature: 0.7,
//   presence_penalty: 0.3,
//   stop: [`\n`],
//   format: `text`,
// };

// Send the POST request using Axios
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

// Introduction (Historical Context) - 21 tokens
// Tone (Casual) - 6 tokens
// Narrative (Suspense) - 7 tokens
// Hyperbole - 3 tokens
// Metaphor - 3 tokens
// Simile - 3 tokens
// Product Details (including labels and IDs) - 124 tokens
// Images (including labels and IDs) - 30 tokens

// Total minimum tokens for all requirements = 21 + 6 + 7 + 3 + 3 + 3 + 124 + 30 = 197 tokens

// Note: The minimum number of tokens required is calculated by taking the shortest possible phrases or descriptions for each requirement, while still fulfilling the specified stylistic requirements. In practice, a well-developed narrative may use more tokens to provide a more engaging and complete story.

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

function generateLanguageRequirementsList(language) {
  const requirementsDict = {
    formats: {},
    introduction: {
      none: {
        prompt: "Introduce the product.",
        tokens: 5,
      },
      overview: {
        prompt:
          "Provide an overview or background information about the product.",
        tokens: 15,
      },
      problemStatement: {
        prompt: "Highlight a problem or need that the product addresses.",
        tokens: 15,
      },
      valueProposition: {
        prompt: "Explain the unique value proposition of the product.",
        tokens: 15,
      },
      historicalContext: {
        prompt:
          "Discuss the historical significance or evolution of the product.",
        tokens: 21,
      },
      targetAudience: {
        prompt:
          "Identify the target audience of the product, and their specific needs or preferences.",
        tokens: 15,
      },
      captivatingStory: {
        prompt: "Share a captivating story or anecdote related to the product.",
        tokens: 40,
      },
      statistics: {
        prompt:
          "Present relevant statistics or data that highlight the importance of the product.",
        tokens: 20,
      },
    },
    tone: {
      none: {
        prompt:
          "Choose a general tone for the product's communication, ensuring that it conveys a balanced and appropriate tone for the target audience.",
        tokens: 5,
      },
      formal: {
        prompt:
          "Select a formal tone for the product's communication, focusing on professionalism and precision to establish credibility and authority.",
        tokens: 8,
      },
      informal: {
        prompt:
          "Choose an informal tone for the product's communication, aiming for a relaxed and conversational style that resonates with the target audience.",
        tokens: 12,
      },
      professional: {
        prompt:
          "Select a professional tone for the product's communication, emphasizing expertise, trustworthiness, and a polished manner of expression.",
        tokens: 12,
      },
      casual: {
        prompt:
          "Choose a casual tone for the product's communication, creating a friendly and approachable atmosphere that makes users feel comfortable and at ease.",
        tokens: 6,
      },
      friendly: {
        prompt:
          "Select a friendly tone for the product's communication, emphasizing warmth, empathy, and a welcoming attitude towards users.",
        tokens: 10,
      },
      authoritative: {
        prompt:
          "Choose an authoritative tone for the product's communication, projecting confidence, expertise, and a commanding presence to establish the product's credibility and influence.",
        tokens: 13,
      },
      persuasive: {
        prompt:
          "Select a persuasive tone for the product's communication, using compelling language, logical arguments, and emotional appeals to convince and influence users.",
        tokens: 12,
      },
      assertive: {
        prompt:
          "Choose an assertive tone for the product's communication, expressing confidence, determination, and a strong sense of purpose to leave a lasting impact on users.",
        tokens: 11,
      },
      serious: {
        prompt:
          "Select a serious tone for the product's communication, focusing on conveying gravity, importance, and a no-nonsense approach to address critical matters effectively.",
        tokens: 11,
      },
      playful: {
        prompt:
          "Choose a playful tone for the product's communication, infusing humor, wit, and lightheartedness to create an enjoyable and entertaining user experience.",
        tokens: 12,
      },
      humorous: {
        prompt:
          "Select a humorous tone for the product's communication, aiming to entertain and evoke laughter while effectively conveying the intended message or information.",
        tokens: 10,
      },
      empathetic: {
        prompt:
          "Choose an empathetic tone for the product's communication, demonstrating understanding, compassion, and sensitivity towards users' needs, concerns, or challenges.",
        tokens: 13,
      },
      compassionate: {
        prompt:
          "Select a compassionate tone for the product's communication, showing genuine care, kindness, and a willingness to help users overcome their difficulties or obstacles.",
        tokens: 14,
      },
      confident: {
        prompt:
          "Choose a confident tone for the product's communication, projecting self-assurance, belief in the product's value, and inspiring trust in users.",
        tokens: 11,
      },
      conversational: {
        prompt:
          "Select a conversational tone for the product's communication, using a natural and engaging language style that resembles a friendly conversation with users.",
        tokens: 14,
      },
      inspirational: {
        prompt:
          "Choose an inspirational tone for the product's communication, aiming to motivate, uplift, and instill a sense of purpose or aspiration in users.",
        tokens: 15,
      },
      educational: {
        prompt:
          "Select an educational tone for the product's communication, focusing on informative and instructional content to impart knowledge and help users learn.",
        tokens: 13,
      },
      motivational: {
        prompt:
          "Choose a motivational tone for the product's communication, using encouraging language, positive reinforcement, and inspiring messages to drive users towards their goals.",
        tokens: 13,
      },
      engaging: {
        prompt:
          "Select an engaging tone for the product's communication, aiming to captivate users' attention, stimulate their interest, and maintain their active involvement.",
        tokens: 12,
      },
      energetic: {
        prompt:
          "Choose an energetic tone for the product's communication, conveying enthusiasm, vigor, and a dynamic spirit to create a sense of excitement and vitality.",
        tokens: 12,
      },
      soothing: {
        prompt:
          "Select a soothing tone for the product's communication, focusing on providing a calming and comforting experience that alleviates stress or anxiety for users.",
        tokens: 13,
      },
      direct: {
        prompt:
          "Choose a direct tone for the product's communication, using concise and straightforward language to convey information or instructions efficiently.",
        tokens: 10,
      },
      concise: {
        prompt:
          "Select a concise tone for the product's communication, aiming for brevity, clarity, and the effective conveyance of information with minimal verbosity.",
        tokens: 11,
      },
      warm: {
        prompt:
          "Choose a warm tone for the product's communication, emphasizing a friendly, inviting, and affectionate approach to create a positive emotional connection with users.",
        tokens: 9,
      },
    },
    feature: {
      design: {
        prompt: "Highlight the innovative and appealing design features.",
        tokens: 9,
      },
      functionality: {
        prompt:
          "Emphasize the practical and functional aspects of the product or idea.",
        tokens: 12,
      },
      customization: {
        prompt:
          "Discuss the customization options or personalization features available.",
        tokens: 12,
      },
      technology: {
        prompt:
          "Explain the advanced technology or cutting-edge features utilized.",
        tokens: 12,
      },
      versatility: {
        prompt:
          "Highlight the versatility and adaptability of the product or service.",
        tokens: 10,
      },
      userExperience: {
        prompt:
          "Focus on the seamless user experience and intuitive interface.",
        tokens: 10,
      },
      sustainability: {
        prompt:
          "Highlight the environmentally-friendly and sustainable features.",
        tokens: 10,
      },
      durability: {
        prompt:
          "Emphasize the durability and long-lasting quality of the product or service.",
        tokens: 11,
      },
    },
    evocative: {
      vividDescriptions: {
        prompt:
          "Incorporate vivid and sensory descriptions to bring the product or idea to life.",
        tokens: 12,
      },
      figurativeLanguage: {
        prompt:
          "Use similes, metaphors, or other figures of speech to create evocative descriptions.",
        tokens: 15,
      },
      storytelling: {
        prompt:
          "Employ storytelling techniques to engage readers and evoke emotions.",
        tokens: 10,
      },
      imagery: {
        prompt:
          "Use descriptive imagery to paint a clear mental picture in the reader's mind.",
        tokens: 10,
      },
      sensoryDetails: {
        prompt:
          "Incorporate sensory details that appeal to sight, sound, touch, taste, and smell.",
        tokens: 12,
      },
      poeticLanguage: {
        prompt:
          "Infuse poetic language and lyrical prose to add beauty and elegance to the descriptions.",
        tokens: 14,
      },
      atmosphere: {
        prompt:
          "Create an atmosphere or mood through descriptive language to set the tone of the article.",
        tokens: 12,
      },
      comparisons: {
        prompt:
          "Make effective comparisons to familiar objects or experiences to enhance understanding.",
        tokens: 10,
      },
    },

    narrative: {
      foreshadowing: {
        prompt:
          "Highlight how the product's features and functionality foreshadow future events or outcomes, providing users with a sense of anticipation and excitement.",
        tokens: 20,
      },
      flashback: {
        prompt:
          "Focus on the product's ability to interrupt the usual sequence of operations, allowing users to revisit and explore past events or memories effortlessly.",
        tokens: 17,
      },
      suspense: {
        prompt:
          "Interpret how the product builds tension and keeps users engaged and curious about the outcome, creating an immersive and thrilling experience.",
        tokens: 7,
      },
      symbolism: {
        prompt:
          "Highlight how the product utilizes symbolic representations through objects, characters, or actions, adding deeper meaning and resonating with users on a profound level.",
        tokens: 20,
      },
      irony: {
        prompt:
          "Interpret how the product presents unexpected outcomes or contrasts, providing users with a delightful and surprising experience that challenges their expectations.",
        tokens: 18,
      },
      metaphor: {
        prompt:
          "Focus on how the product makes vivid and imaginative comparisons between unrelated elements, enabling users to understand complex concepts or ideas more intuitively.",
        tokens: 18,
      },
      simile: {
        prompt:
          "Highlight the product's use of similes to describe its features or functionality in a relatable and understandable way, making it easy for users to grasp its value.",
        tokens: 18,
      },
      allusion: {
        prompt:
          "Interpret how the product references well-known people, events, or works of literature, evoking certain emotions or associations that resonate with users.",
        tokens: 17,
      },
      allegory: {
        prompt:
          "Focus on how the product uses a narrative or story to represent abstract ideas or moral principles, allowing users to engage with deeper meanings and messages.",
        tokens: 17,
      },
      juxtaposition: {
        prompt:
          "Highlight how the product juxtaposes contrasting elements or ideas, emphasizing their differences and creating a sense of tension that captivates users.",
        tokens: 17,
      },
      imagery: {
        prompt:
          "Focus on how the product uses vivid and descriptive language to create mental images and sensory experiences for users, immersing them in a rich and captivating environment.",
        tokens: 20,
      },
      dialogue: {
        prompt:
          "Interpret how the product incorporates meaningful conversations between users or characters, revealing their thoughts, emotions, and relationships, and enhancing the overall user experience.",
        tokens: 20,
      },
      point_of_view: {
        prompt:
          "Highlight the product's unique narrative perspective or point of view, whether it's first-person, third-person limited, or third-person omniscient, providing users with a distinct and engaging storytelling experience.",
        tokens: 23,
      },
      cliffhanger: {
        prompt:
          "Focus on how the product ends each stage or phase with suspenseful or unresolved situations, leaving users wanting more and eager to continue their journey.",
        tokens: 20,
      },
      character_development: {
        prompt:
          "Interpret how the product allows for the progression and growth of characters or user profiles, including their thoughts, actions, and relationships, providing a dynamic and immersive user experience.",
        tokens: 25,
      },
      plot_twist: {
        prompt:
          "Highlight the product's ability to introduce unexpected or surprising changes in the storyline or user journey, challenging users' expectations and keeping them engaged and intrigued.",
        tokens: 20,
      },
      narrative_voice: {
        prompt:
          "Interpret how the product's narrative voice, whether it's from the narrator or the main character, creates a unique style, tone, and personality, enhancing the overall user experience and immersing users in the story.",
        tokens: 22,
      },
      setting: {
        prompt:
          "Highlight how the product's time, place, and environment contribute to the overall mood and atmosphere, creating an immersive and engaging experience for users.",
        tokens: 18,
      },
      motif: {
        prompt:
          "Interpret how the product incorporates recurring elements, images, or themes that hold symbolic significance throughout the user journey, providing users with a cohesive and meaningful experience.",
        tokens: 20,
      },
      prologue_epilogue: {
        prompt:
          "Focus on how the product incorporates an introductory or concluding section, such as a prologue or epilogue, providing users with additional context or insight into the product story and enhancing their overall understanding and engagement.",
        tokens: 23,
      },
    },
    rhetorical: {
      anaphora: {
        prompt:
          "Use the repetition of the same word or phrase at the beginning of successive clauses or sentences to emphasize key points or concepts, creating a powerful and memorable impact.",
        tokens: 23,
      },
      chiasmus: {
        prompt:
          "Use a reversal in the order of words or phrases in successive clauses to create a contrasting effect, capturing users' attention and making a lasting impression.",
        tokens: 18,
      },
      hyperbole: {
        prompt:
          "Convey emphasis and dramatic effect through the use of exaggerated statements, showcasing its unique features and benefits in an attention-grabbing and memorable way.",
        tokens: 3,
      },
      metaphor: {
        prompt:
          "Employs metaphors to create vivid images and convey deeper meanings, enabling users to relate to and understand its value proposition on a deeper level.",
        tokens: 3,
      },
      simile: {
        prompt:
          "Use similes to highlight similarities between two different things, making its benefits more relatable and easily understandable for users.",
        tokens: 3,
      },
      alliteration: {
        prompt:
          "Use alliteration, which involves the repetition of the same sound or letter at the beginning of closely connected words, creating a rhythmic and memorable effect that captures users' attention.",
        tokens: 17,
      },
      antithesis: {
        prompt:
          "Use antithesis, where contrasting ideas or words are juxtaposed to create a balanced and contrasting effect.",
        tokens: 14,
      },
      "rhetorical question": {
        prompt:
          "Use rhetorical questions to engage users and make thought-provoking points, stimulating their thinking and prompting them to consider the product's benefits and advantages.",
        tokens: 17,
      },
      irony: {
        prompt:
          "Use irony, where words are used to convey a meaning opposite to their literal interpretation, creating a sense of intrigue and making users reflect on the product's underlying message or value.",
        tokens: 18,
      },
      personification: {
        prompt:
          "Use personification, attributing human qualities or characteristics to non-human entities or abstract concepts, making the product more relatable and fostering an emotional connection with users.",
        tokens: 21,
      },
      metonymy: {
        prompt:
          "Use metonymy, where a related word or phrase is used to represent something else based on association or proximity, making it easier for users to understand and remember key aspects of the product.",
        tokens: 22,
      },
      onomatopoeia: {
        prompt:
          "Incorporates onomatopoeia, using words that imitate the sounds they represent, creating a sensory experience and making the product more engaging and memorable for users.",
        tokens: 21,
      },
      polysyndeton: {
        prompt:
          "Use polysyndeton, the repetition of conjunctions (e.g., 'and', 'or') in close succession, creating a rhythmic and impactful effect that draws users' attention and emphasizes key features or benefits.",
        tokens: 24,
      },
      asyndeton: {
        prompt:
          "Use asyndeton, the omission of conjunctions between words or phrases, creating a concise or rapid effect that highlights the product's efficiency, simplicity, or speed.",
        tokens: 19,
      },
      epistrophe: {
        prompt:
          "Use the repetition of the same word or phrase at the end of successive clauses or sentences to emphasize key points or concepts, leaving a lasting impression on users and reinforcing the product's message.",
        tokens: 23,
      },
    },
    engagingFormats :{
      textWithVisuals: {
        prompt: "Create a series of brief slides with concise text to tell a story or convey a message. Enhance each slide using imagery, animations, or graphics.",
      },
      quotesMessages: {
        prompt: "Share inspirational quotes, motivating messages, or thought-provoking statements. Divide them into multiple slides to emphasize and leave an impact.",
      },
      howToTips: {
        prompt: "Provide quick tips, life hacks, or step-by-step instructions. Split the content across multiple slides, highlighting each tip or step.",
      },
      factsStatistics: {
        prompt: "Present intriguing facts, statistics, or trivia with visual appeal. Unveil each piece of information one by one across different slides.",
      },
      storytelling: {
        prompt: "Engage viewers with short, captivating stories. Use cliffhangers to encourage swiping for the next part of the story.",
      },
      questionAnswer: {
        prompt: "Ask a question on one slide and offer the answer on the next. Encourage audience engagement and interaction.",
      },
      beforeAfter: {
        prompt: "Showcase transformations, makeovers, or progress using a before-and-after approach. Each slide reveals a different stage of change.",
      },
      listsRankings: {
        prompt: "Create lists or rankings of items, ideas, or preferences. Number the slides to guide viewers through the list.",
      },
      miniBlogInsights: {
        prompt: "Share bite-sized insights, mini-blog posts, or reflections. Split the content into several slides for a series of concise thoughts.",
      },
      wordplayPuns: {
        prompt: "Craft clever wordplay, puns, or jokes that unfold across multiple slides. Entertain and engage your audience with humor.",
      },
      fictionalStories: {
        prompt: "Write brief fictional stories or scenarios that span across slides. Keep viewers engaged by revealing the plot gradually.",
      },
      educationalNuggets: {
        prompt: "Share interesting facts, history, or cultural insights in small, digestible portions across multiple slides.",
      }
    },
    socialMedia: {
      none: {
        prompt:
          "Choose a target audience that encompasses a general demographic without specific platform preferences.",
        tokens: 18,
      },
      facebook: {
        prompt:
          "Select the target audience for Facebook, focusing on users who engage with content and interactions on this platform.",
        tokens: 21,
      },
      twitter: {
        prompt:
          "Choose the target audience for Twitter, focusing on users who actively participate in discussions and trends on this platform.",
        tokens: 20,
      },
      instagram: {
        prompt:
          "Select the target audience for Instagram, focusing on users who engage with visual content and social interactions on this platform.",
        tokens: 21,
      },
      linkedin: {
        prompt:
          "Choose the target audience for LinkedIn, focusing on professionals and businesses who utilize this platform for networking and career-related purposes.",
        tokens: 24,
      },
      pinterest: {
        prompt:
          "Select the target audience for Pinterest, focusing on users who actively search for and engage with visual content related to various interests and hobbies.",
        tokens: 23,
      },
      snapchat: {
        prompt:
          "Choose the target audience for Snapchat, focusing on users who prefer ephemeral and interactive content experiences on this platform.",
        tokens: 21,
      },

      youtube: {
        prompt:
          "Choose the target audience for YouTube, focusing on users who consume and engage with video content across various topics and genres on this platform.",
        tokens: 24,
      },
      reddit: {
        prompt:
          "Select the target audience for Reddit, focusing on users who actively participate in communities and discussions on this platform.",
        tokens: 20,
      },
      tumblr: {
        prompt:
          "Choose the target audience for Tumblr, focusing on users who enjoy creative expression, multimedia content, and niche interests on this platform.",
        tokens: 22,
      },
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
    academicFormats: {
      researchPapers: {
        definition:
          "Academic research papers present original research findings, methodologies, and analysis on a specific topic.",
        prompt:
          "Please provide a research paper that presents original research findings, methodologies, and analysis on a specific topic.",
        tokens: 28,
      },
      reviewArticles: {
        definition:
          "Review articles provide a comprehensive overview and analysis of existing research and literature on a particular topic.",
        prompt:
          "Please provide a review article that offers a comprehensive overview and analysis of existing research and literature on a particular topic.",
        tokens: 31,
      },
      caseStudies: {
        definition:
          "Academic case studies analyze a particular individual, organization, event, or phenomenon in depth.",
        prompt:
          "Please provide an academic case study that analyzes a particular individual, organization, event, or phenomenon in depth.",
        tokens: 26,
      },
      thesesAndDissertations: {
        definition:
          "Theses and dissertations are formal documents submitted by students to fulfill the requirements of an academic degree.",
        prompt:
          "Please provide a thesis or dissertation that meets the formal requirements for an academic degree.",
        tokens: 40,
      },
      conferencePapers: {
        definition:
          "Conference papers are documents prepared for presentation at academic conferences or symposiums.",
        prompt:
          "Please provide a conference paper that has been prepared for presentation at an academic conference or symposium.",
        tokens: 25,
      },
      literatureReviews: {
        definition:
          "Literature reviews summarize and analyze existing research and publications on a particular topic.",
        prompt:
          "Please provide a literature review that summarizes and analyzes existing research and publications on a particular topic.",
        tokens: 27,
      },
      abstracts: {
        definition:
          "Abstracts are concise summaries of a research paper, conference presentation, or article.",
        prompt:
          "Please provide an abstract that serves as a concise summary of a research paper, conference presentation, or article.",
        tokens: 24,
      },
      academicEssays: {
        definition:
          "Academic essays are shorter written compositions that present arguments or analyses on a specific topic.",
        prompt:
          "Please provide an academic essay that presents arguments or analyses on a specific topic.",
        tokens: 21,
      },
    },
  };

  const requirements = [];

  if (language) {
    for (const [key, value] of language) {
      // console.log('key: ' + key + ' value: ' + value)
      const keyLabelRequirements = [key, []];
      for (const valueOption of value) {
        const prompts = keyLabelRequirements[1];
        prompts.push({
          value: valueOption,
          prompt: requirementsDict[key][valueOption]?.prompt,
        });
      }
      requirements.push(keyLabelRequirements);
    }
  }

  return requirements;
}

export async function generateReport({
  productData,
  includedFocusPoints,
  languageAndFormattingOptions,
  requestType,
}) {
  const requirementsList = generateLanguageRequirementsList(
    productData,
    includedFocusPoints,
    languageAndFormattingOptions
  );

  const prompt = generateLanguageRequirementsList(
    productData,
    includedFocusPoints,
    languageAndFormattingOptions
  );

  return prompt;
}

const colors = generateComplementaryScheme("#A66F2E", 200);





function imageId(url) {
  if (!url) {
    "report this error imageId:" + Math.random().toString();
  }
  let indexOfLastPeriod = url.lastIndexOf(".");
  if (indexOfLastPeriod === -1) {
    indexOfLastPeriod = url.length;
  }
  let lastBackSlash = url.lastIndexOf("/");
  if (lastBackSlash === -1) {
    lastBackSlash = -5 + indexOfLastPeriod;
  }

  return url.slice(-lastBackSlash + indexOfLastPeriod, indexOfLastPeriod);
}

function toSingular(word) {
  if (!word) {
    "report this error singular:" + Math.random().toString();
  }

  return pluralize.singular(word);
}

const filterKey = (label) => {
  if (!label) {
    "report this error filterKey" + Math.random().toString();
  }
  label = label.replace(/^.*?_/g, "");
  return toSingular(label);
};

const filterElement = (label) => {
  if (!label) {
    "report this error filterElement:" + Math.random().toString();
  }
  label = label.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  label = label
    .replace(/inventory/g, "")
    .replace(/:/g, "")
    .trim()
    .toLowerCase();
  return label;
};

const adjustedLabels = (label, key, numb) => {
  if (label === "none") {
    label = `stand ${key} ${numb}`;
  } else {
    label = filterElement(label);
  }
  return label;
};

function focusRequirements(productData, details, requirements) {
  let colorIndex = 0;

  const getColor = () => {
    const color = colors[colorIndex++];
    const id = `${color}`;
    return { color, id };
  };

  const exampleDetails = [];
  const exampleStyles = [];
  const legend = [];
  const lines = [];

  const addLine = (text) => lines.push(text);
  const addLineFront = (text) => lines.unshift(text);
  const addHeading = (heading) => addLine(`\n${heading}`);
const addQuotes= (text) => text.length ? `"${text}"`: '';

  const addProductDescription = (exampleDetails, exampleStyles) => {
    const exampleDetailsStr = exampleDetails
      .slice(-1)
      .map(([key, value]) => `(${key} - ${value})`)
      .join(", ");

    const exampleStylesStr = exampleStyles
      .slice(-1)
      .map(([key, value]) => `(${key} - ${value})`)
      .join(",  ");
    const title = productData.title.replace(/\n/g, "");
    addLineFront(
      `Compose a narrative that introduces the ${title} and creatively incorporates the following product details using the narrative stylistic requirements below. In this document are unique identifiers; they look like this ${addQuotes(exampleDetailsStr)}. These are all requirements. Reference them in the composition as labels, where you fulfill a requirement. Examples: ${addQuotes(exampleStylesStr)}  ${addQuotes(exampleDetailsStr)}`
    );
    addLineFront(`Product Name: ${title}`);
  };

  const addSectionDetails = (section, heading) => {
    details.forEach(([key, value]) => {
      if (section === key) {
        console.log(section, value);
        addHeading(heading);

        value.forEach((element, index) => {
          if (element) {
            const { color, id } = getColor();
            let line;

            if (key === "collections") {
              legend.push([element.title, color]);
              exampleDetails.push([element.title, id]);
              line = `\n\t${index + 1}. (${element.title}: ${id}).`;
            } else if (key === "images") {
              legend.push([element, color]);
              exampleDetails.push([imageId(element), id]);
              console.log("element---->", element);
              line = `\n\t${index + 1}. ${element}\n\t${imageId(element).slice(
                -9
              )} : ${id}.\n`;
            } else if (key === "description") {
              exampleDetails.push(["description", id]);
              line = `\n\t${index + 1}. ${element}\n\tdescription : ${id}.`;
            } else {
              legend.push([element, color]);
              exampleDetails.push([element, id]);
              line = `\n\t${index + 1}. ${element}: ${id}.`;
            }

            addLine(line);
          }
        });
      }
    });
    // addLine("\n");
  };

  const addOtherDetails = () => {
    const other = details.filter(
      (headings) =>
        !["collections", "images", "description"].includes(headings[0])
    );
    other.forEach(([key, elements]) => {
      if (key.includes("variant")) {
        let focus = `${key.replace(/[_]/g, ": ")}`;

        const { color, id } = getColor();
        legend.push([focus.slice(), color]);
        focus = `Creatively incorporate the variant: "${focus
          .replace(/variant:/g, "")
          .trim()}" options in the composition using the stylistic requirements below:`;

        addLine(`${focus}\n`);
        elements.forEach((element, index) => {
          if (element.includes("title")) return;
          const { color, id } = getColor();

          legend.push([element, color]);
          exampleDetails.push([
            `\t${filterKey(key)} ${filterElement(element)}`,
            color,
          ]);
          addLine(
            `\t${index + 1}. (${filterElement(element)} - ${id})${
              index === elements.length - 1 ? ".\n" : ".\n"
            }`
          );
        });
      } else if (key.includes("option")) {
        let focus = `${key.replace(/[_]/g, ": ")}`;
        const { color, id } = getColor();
        legend.push([focus.slice(), color]);
        focus = `Creatively incorporate these selectable ${pluralize(
          focus.replace(/(\w+)\s*:\s*(\w+)/g, "$2")
        )} in the composition:`;

        addLine(`${focus}\n`);
        elements.forEach((element, index) => {
          if (element.includes("title")) return;
          const { color, id } = getColor();

          legend.push([element, color]);
          exampleDetails.push([
            `${filterKey(key)} ${filterElement(element)}`,
            color,
          ]);
          addLine(
            `\t${index + 1}. (${filterElement(element)} - ${id})${
              index === elements.length - 1 ? ".\n" : ".\n"
            }`
          );
        });
      } else if (key.includes("tags")) {
        let focus = `${key.replace(/[_]/g, ": ")}`;
        console.log("tags", focus);
        focus = `Creatively incorporate these tags in the composition using the stylistic requirements below:`;

        addLine(`${focus}\n`);
        elements.forEach((element, index) => {
          if (element.includes("title")) return;
          const { color, id } = getColor();

          legend.push([element, color]);
          exampleDetails.push([
            `\t${filterKey(key)} ${filterElement(element)}`,
            color,
          ]);
          addLine(
            `\t${index + 1}. (${filterElement(element)} - ${id})${
              index === elements.length - 1 ? ".\n" : ".\n"
            }`
          );
        });
      }
    });
  };

  const addNarrativeRequirements = () => {
    addHeading(
      `Compose a narrative with these narrative stylistic requirements.\n`
    );
    requirements.forEach(([key, narrativeStyles], index) => {
      key === "rhetorical"
        ? addLine(
            `Requirement ${
              index + 1
            } Skillfully employ these ${key} techniques in the composition using the product details above.`
          )
        : addLine(`Requirement ${index + 1} ${key}\n`);

      narrativeStyles.forEach((narrativeStyle, i, arrayStyles) => {
        const { color, id } = getColor();
        legend.push([narrativeStyle.value, color]);
        exampleStyles.push([
          adjustedLabels(narrativeStyle.value, key, i + 1),
          color,
        ]);
        addLine(
          `\t${key === "rhetorical" ? "" : narrativeStyle.prompt}\n\t${
            arrayStyles.length > 1 ? i + 1 + " " : ""
          }(${adjustedLabels(narrativeStyle.value, key, i + 1)} - ${id})\n`
        );
      });
    });
  };

  const addFinalSection = () => {
    const exampleDetailsStr = exampleDetails
      .slice(0, 1)
      .map(([key, value]) => `(${key} - ${value})`)
      .join(" or ");

    const exampleStylesStr = exampleStyles
      .slice(0, 1)
      .map(([key, value]) => `(${key} - ${value})`)
      .join(" or ");

    addLine(
      `\nUse a single round bracket tags for every label and id to reference the requirements in the composition. Tag examples: ${addQuotes(exampleDetailsStr)}  ${addQuotes(exampleStylesStr)}`
    );
  };

  addSectionDetails(
    "collections",
    "Mention these collections in the composition, using the narrative stylistic requirements listed below:"
  );
  addSectionDetails(
    "description",
    "Use this description to hone your composition:"
  );
  addSectionDetails(
    "images",
    "Provide a visual context for the product in the composition by cleverly placing and calling attention to the image URL in the composition. Reference them with the labeled id beneath each URL in the composition:"
  );
  addOtherDetails();
  addNarrativeRequirements();
  addFinalSection();
  // Main Execution Flow
  addProductDescription(exampleDetails, exampleStyles);
  const prompt = lines.join("\n");
  return { prompt, legend, documentType: "text" };
}

export function withoutOptions(productData) {
  const language = [
    ["introduction", ["none"]],
    ["tone", ["none"]],
  ];

  const focus = [];

  const requirementsList = generateLanguageRequirementsList(language);
  const prompt = focusRequirements(productData, focus, requirementsList);

  return prompt;
}

export function withLanguageOption(productData, language) {
  language = language.map((languageOptions) => languageOptions[1]);

  const focus = [];
  const requirementsList = generateLanguageRequirementsList(language);
  const prompt = focusRequirements(productData, focus, requirementsList);
  console.log("prompt with language only");
  return prompt;
}

export function withProductDetails(productData, focus) {
  const language = [
    ["introduction", ["none"]],
    ["tone", ["none"]],
  ];

  const requirementsList = generateLanguageRequirementsList(language);
  const prompt = focusRequirements(productData, focus, requirementsList);
  console.log("prompt with product only");
  return prompt;
}

export function withLanguageAndProductOption(productData, language, focus) {
  language = language.map((languageOptions) => languageOptions[1]);
  const requirementsList = generateLanguageRequirementsList(language);

  const prompt = focusRequirements(productData, focus, requirementsList);
  console.log("prompt with both options");
  return prompt;
}
