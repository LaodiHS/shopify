const ChinesFigureOfSpeech = {
  categories: [
    {
      category: "Figures of speech",
      devices: [
        {
          name: "Metaphor",
          chineseName: "比喻",
          phonetic: "Bǐyù",
          definition: {
            english:
              "A figure of speech that involves making a comparison between two unrelated things.",
            chinese: "一种修辞手法，通过将两个不相关的事物进行比较来表达意义。",
          },
        },
        {
          name: "Hyperbole",
          chineseName: "夸张",
          phonetic: "Kuāzhāng",
          definition: {
            english:
              "Exaggerated statements or claims used for emphasis or dramatic effect.",
            chinese: "夸大的陈述或言论，用于强调或产生戏剧效果。",
          },
        },
        {
          name: "Irony",
          chineseName: "反讽",
          phonetic: "Fǎnfǔ",
          definition: {
            english:
              "A rhetorical device in which the intended meaning is opposite to the literal meaning.",
            chinese: "修辞手法，意义与字面意义相反。",
          },
        },
        {
          name: "Personification",
          chineseName: "拟人",
          phonetic: "Nǐrén",
          definition: {
            english:
              "Attributing human qualities or characteristics to non-human entities.",
            chinese: "将非人类实体赋予人类的特质或特征。",
          },
        },
      ],
    },
    {
      category: "Parallelism",
      devices: [
        {
          name: "Antithesis",
          chineseName: "对偶",
          phonetic: "Duìǒu",
          definition: {
            english:
              "Juxtaposing contrasting ideas or words to create a balanced and rhythmic effect.",
            chinese: "将对立的观点或词语并列放置，以产生平衡和节奏感。",
          },
        },
        {
          name: "Parallelism",
          chineseName: "排比",
          phonetic: "Páibǐ",
          definition: {
            english:
              "Repeating similar grammatical structures or patterns for emphasis or rhetorical effect.",
            chinese: "通过重复类似的语法结构或模式来强调或产生修辞效果。",
          },
        },
        {
          name: "Repetition",
          chineseName: "重复",
          phonetic: "Chóngfù",
          definition: {
            english:
              "The act of repeating words or phrases for emphasis or to create a memorable impact.",
            chinese: "重复使用单词或短语以强调或产生记忆效果。",
          },
        },
      ],
    },
    {
      category: "Analogy",
      devices: [
        {
          name: "Simile",
          chineseName: "明喻",
          phonetic: "Míngyù",
          definition: {
            english:
              "A figure of speech that directly compares two things using 'like' or 'as'.",
            chinese: "一种修辞手法，通过使用“像”或“如同”来直接比较两个事物。",
          },
        },
        {
          name: "Analogy",
          chineseName: "比拟",
          phonetic: "Bǐnǐ",
          definition: {
            english:
              "Drawing a comparison between two different things to illustrate a similarity.",
            chinese: "通过比较两个不同的事物来说明相似之处。",
          },
        },
      ],
    },
    {
      category: "Rhetorical questions",
      devices: [
        {
          name: "Rhetorical questions",
          chineseName: "反问",
          phonetic: "Fǎnwèn",
          definition: {
            english:
              "A question asked to make a point or to create an effect rather than to elicit an answer.",
            chinese: "一种用于强调观点或产生效果而非寻求答案的问句。",
          },
        },
        {
          name: "Rhetorical exclamations",
          chineseName: "反感叹",
          phonetic: "Fǎngǎntàn",
          definition: {
            english:
              "Expressions of strong feelings or emotions used for rhetorical impact.",
            chinese: "通过表达强烈的感情或情绪来产生修辞效果。",
          },
        },
      ],
    },
    {
      category: "Rhetorical techniques",
      devices: [
        {
          name: "Repetition",
          chineseName: "重复",
          phonetic: "Chóngfù",
          definition: {
            english:
              "The act of repeating words or phrases for emphasis or to create a memorable impact.",
            chinese: "重复使用单词或短语以强调或产生记忆效果。",
          },
        },
        {
          name: "Allusion",
          chineseName: "典故",
          phonetic: "Diǎngù",
          definition: {
            english:
              "A reference to a person, place, event, or work of literature that enhances meaning or understanding.",
            chinese: "对人物、地点、事件或文学作品的引用，以增强意义或理解。",
          },
        },
        {
          name: "Euphemism",
          chineseName: "委婉语",
          phonetic: "Wěiwǎn yǔ",
          definition: {
            english:
              "The use of mild or indirect words or phrases to substitute for something unpleasant or offensive.",
            chinese: "使用温和或间接的词语来代替令人不快或冒犯的事物。",
          },
        },
        {
          name: "Understatement",
          chineseName: "轻描淡写",
          phonetic: "Qīngmiáodànxiě",
          definition: {
            english:
              "The deliberate downplaying or minimizing of the significance or importance of something.",
            chinese: "有意淡化或减小某事物的重要性或意义。",
          },
        },
      ],
    },
  ],
};
export const audienceModel = {
  pageTitle: "Audience",
  sections: [
    {
      sectionTitle: "Audience: ",
      IonItems: [
        {
          IonElement: "IonSelect",
          label: "Select Language",
          placeholder: "Select",
          category: "language",
          default: "english",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "english",
                title: "English",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "spanish",
                title: "Spanish",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "french",
                title: "French",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "german",
                title: "German",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "italian",
                title: "Italian",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "portuguese",
                title: "Portuguese",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "chinese",
                title: "Chinese",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "japanese",
                title: "Japanese",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "korean",
                title: "Korean",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "russian",
                title: "Russian",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "arabic",
                title: "Arabic",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "hindi",
                title: "Hindi",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "bengali",
                title: "Bengali",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "urdu",
                title: "Urdu",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "swahili",
                title: "Swahili",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "dutch",
                title: "Dutch",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "turkish",
                title: "Turkish",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "greek",
                title: "Greek",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "polish",
                title: "Polish",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "swedish",
                title: "Swedish",
                subscriptions: ["sourwood", "acacia"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Introduction: Select a Context",
          placeholder: "Select",
          category: "introduction",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "none",
                title: "General Intro",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "overview",
                title: "General Overview",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "problemStatement",
                title: "Addresses a Problem",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "valueProposition",
                title: "Unique Value",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "historicalContext",
                title: "Product History",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "targetAudience",
                title: "Audience Needs",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "captivatingStory",
                title: "Captivating Story",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "statistics",
                title: "Relevant Statistics",
                subscriptions: ["sourwood", "acacia"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Select a Tone",
          placeholder: "Select",
          category: "tone",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "none",
                title: "General Tone",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "formal",
                title: "Formal",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "informal",
                title: "Informal",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "professional",
                title: "Professional",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "casual",
                title: "Casual",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "friendly",
                title: "Friendly",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "authoritative",
                title: "Authoritative",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "persuasive",
                title: "Persuasive",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "assertive",
                title: "Assertive",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "serious",
                title: "Serious",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "playful",
                title: "Playful",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "humorous",
                title: "Humorous",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "empathetic",
                title: "Empathetic",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "compassionate",
                title: "Compassionate",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "confident",
                title: "Confident",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "conversational",
                title: "Conversational",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "inspirational",
                title: "Inspirational",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "educational",
                title: "Educational",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "motivational",
                title: "Motivational",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "engaging",
                title: "Engaging",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "energetic",
                title: "Energetic",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "soothing",
                title: "Soothing",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "authoritative",
                title: "Authoritative",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "direct",
                title: "Direct",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "concise",
                title: "Concise",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "warm",
                title: "Warm",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
            ],
          },
        },

        {
          IonElement: "IonSelect",
          label: "Feature: Select a Focus for your Product or Idea",
          placeholder: "Select",
          category: "focus",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "none",
                title: "General Focus",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "design",
                title: "Innovative Appeal",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "functionality",
                title: "Practical & Functional",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "customization",
                title: "Customization Options",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "technology",
                title: "Advanced Technology",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "versatility",
                title: "Versatile & Adaptable",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "userExperience",
                title: "Seamless User Experience",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "sustainability",
                title: "Environmentally-Friendly",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "durability",
                title: "Long-Lasting",
                subscriptions: ["sourwood", "acacia"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Evocative Language: Choose a Style",
          placeholder: "Select",
          category: "evocative",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "none",
                title: "General Language",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "vividDescriptions",
                title: "Vivid Descriptions",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "figurativeLanguage",
                title: "Figurative Language",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "storytelling",
                title: "Engaging Storytelling",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "imagery",
                title: "Descriptive Imagery",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "sensoryDetails",
                title: "Appealing Sensory Details",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "poeticLanguage",
                title: "Poetic Language",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "atmosphere",
                title: "Creating Atmosphere",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "comparisons",
                title: "Effective Comparisons",
                subscriptions: ["sourwood", "acacia"],
              },
            ],
          },
        },

        {
          IonElement: "IonSelect",
          label:
            "Devices: Select the Narrative Devices you want to Incorporate",
          placeholder: "Select",
          category: "narrative",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "none",
                title: "General Narrative",
                definition: "General narrative already included",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "foreshadowing",
                title: "Foreshadowing",
                definition:
                  "Hinting or suggesting future events or outcomes in a story.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "flashback",
                title: "Flashback",
                definition:
                  "Interrupting the chronological sequence to describe past events or memories.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "suspense",
                title: "Suspense",
                definition:
                  "Building tension and anticipation to keep the audience engaged and curious about the outcome.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "symbolism",
                title: "Symbolism",
                definition:
                  "Using objects, characters, or actions to represent deeper meanings or concepts.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "irony",
                title: "Irony",
                definition:
                  "Presenting something in a way that contrasts with its actual meaning or outcome.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "metaphor",
                title: "Metaphor",
                definition:
                  "Making a comparison between two unrelated things to create a vivid image or convey a deeper meaning.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "simile",
                title: "Simile",
                definition:
                  "Making a comparison using 'like' or 'as' to describe something in a more relatable or understandable way.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "allusion",
                title: "Allusion",
                definition:
                  "Referencing or mentioning a well-known person, event, or work of literature to evoke certain emotions or associations.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "allegory",
                title: "Allegory",
                definition:
                  "Using a story or narrative to represent abstract ideas or moral principles.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "juxtaposition",
                title: "Juxtaposition",
                definition:
                  "Placing two contrasting elements or ideas side by side to highlight their differences or create tension.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "imagery",
                title: "Imagery",
                definition:
                  "Using vivid and descriptive language to create mental images and sensory experiences for the reader.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "dialogue",
                title: "Dialogue",
                definition:
                  "Conversation between characters that reveals their thoughts, emotions, and relationships.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "point_of_view",
                title: "Point of View",
                definition:
                  "The perspective from which the story is narrated, such as first-person, third-person limited, or third-person omniscient.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "cliffhanger",
                title: "Cliffhanger",
                definition:
                  "Ending a chapter or section of a story with a suspenseful or unresolved situation to keep the reader engaged.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "character_development",
                title: "Character Development",
                definition:
                  "The progression and growth of characters throughout the story, including their thoughts, actions, and relationships.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "plot_twist",
                title: "Plot Twist",
                definition:
                  "Unexpected or surprising changes in the storyline that challenge the reader's expectations.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "narrative_voice",
                title: "Narrative Voice",
                definition:
                  "The unique style, tone, and personality of the narrator or main character.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "setting",
                title: "Setting",
                definition:
                  "The time, place, and environment in which the story takes place, contributing to the overall mood and atmosphere.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "motif",
                title: "Motif",
                definition:
                  "A recurring element, image, or theme that holds symbolic significance throughout the narrative.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "prologue_epilogue",
                title: "Prologue/Epilogue",
                definition:
                  "An introductory or concluding section that provides additional context or insight into the story.",
                subscriptions: ["sourwood", "acacia"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Rhetorical Devices: Select the ones you want to include",
          placeholder: "Select One or More (Limit: 4)",
          category: "rhetorical",
          default: [],
          multiple: true,
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "anaphora",
                title: "Anaphora",
                definition:
                  "Repetition of the same word or phrase at the beginning of successive clauses or sentences for emphasis.",

                subscriptions: ["acacia"],
              },
              {
                value: "chiasmus",
                title: "Chiasmus",
                definition:
                  "A reversal in the order of words or phrases in successive clauses to create a contrasting effect.",
                subscriptions: ["acacia"],
              },
              {
                value: "hyperbole",
                title: "Hyperbole",
                definition: "Exaggeration for emphasis or dramatic effect.",
                subscriptions: ["acacia"],
              },
              {
                value: "metaphor",
                title: "Metaphor",
                definition:
                  "Comparison between two unrelated things to create a vivid image or convey meaning.",
                subscriptions: ["acacia"],
              },
              {
                value: "simile",
                title: "Simile",
                definition:
                  "Comparison using 'like' or 'as' to highlight similarities between two different things.",
                subscriptions: ["acacia"],
              },
              {
                value: "alliteration",
                title: "Alliteration",
                definition:
                  "Repetition of the same sound or letter at the beginning of closely connected words.",
                subscriptions: ["acacia"],
              },
              {
                value: "antithesis",
                title: "Antithesis",
                definition:
                  "Juxtaposition of contrasting ideas or words to create a balanced and contrasting effect.",
                subscriptions: ["acacia"],
              },
              {
                value: "rhetorical question",
                title: "Rhetorical Question",
                definition:
                  "A question asked for effect or to make a point, rather than expecting a direct answer.",
                subscriptions: ["acacia"],
              },
              {
                value: "irony",
                title: "Irony",
                definition:
                  "Use of words to convey a meaning opposite to their literal interpretation.",
                subscriptions: ["acacia"],
              },
              {
                value: "personification",
                title: "Personification",
                definition:
                  "Attribution of human qualities or characteristics to non-human entities or abstract concepts.",
                subscriptions: ["acacia"],
              },
              {
                value: "metonymy",
                title: "Metonymy",
                definition:
                  "Use of a related word or phrase to represent something else, often based on association or proximity.",
                subscriptions: ["acacia"],
              },
              {
                value: "onomatopoeia",
                title: "Onomatopoeia",
                definition:
                  "Use of words that imitate the sound they represent.",
                subscriptions: ["acacia"],
              },
              {
                value: "polysyndeton",
                title: "Polysyndeton",
                definition:
                  "Repetition of conjunctions (e.g., 'and', 'or') in close succession for rhetorical effect.",
                subscriptions: ["acacia"],
              },
              {
                value: "asyndeton",
                title: "Asyndeton",
                definition:
                  "Omission of conjunctions between words or phrases for a concise or rapid effect.",
                subscriptions: ["acacia"],
              },
              {
                value: "epistrophe",
                title: "Epistrophe",
                definition:
                  "Repetition of the same word or phrase at the end of successive clauses or sentences for emphasis.",
                subscriptions: ["acacia"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Your Social Media Audience: Select An Audience",
          placeholder: "Select",
          category: "socialMedia",
          default: "none",
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "none",
                title: "General",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "twitter",
                title: "Twitter Audience",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "instagram",
                title: "Instagram Audience",
                subscriptions: ["chestnut", "sourwood", "acacia"],
              },
              {
                value: "linkedin",
                title: "LinkedIn Audience",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "pinterest",
                title: "Pinterest Audience",
                subscriptions: ["acacia"],
              },
              {
                value: "snapchat",
                title: "Snapchat Audience",
                subscriptions: ["acacia"],
              },
              {
                value: "tiktok",
                title: "TikTok Audience",
                subscriptions: ["acacia"],
              },
              {
                value: "facebook",
                title: "Facebook Audience",
                subscriptions: ["acacia"],
              },
              {
                value: "youtube",
                title: "YouTube Audience",
                subscriptions: ["acacia"],
              },
              {
                value: "reddit",
                title: "Reddit Audience",
                subscriptions: ["acacia"],
              },
              {
                value: "tumblr",
                title: "Tumblr Audience",
                subscriptions: ["acacia"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Engaging Short Form Formats: Select Your Format",
          placeholder: "Select",
          category: "engagingFormats",
          default: "none",
          values: {
            tag: "ion-select-option",
            options: [
              // Additional audience types
              {
                value: "none",
                title: "general",
                subscriptions: ["free", "chestnut", "sourwood", "acacia"],
              },
              {
                value: "textWithVisuals",
                title: "textWithVisuals",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "quotesMessages",
                title: "quotes messages",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "storytelling",
                title: "storyTelling",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "questionAnswer",
                title: "questionAnswer",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "beforeAfter",
                title: "beforeAfter",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "listsRankings",
                title: "listsRankings",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "miniBlogInsights",
                title: "miniBlogInsights",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "wordplayPuns",
                title: "wordplayPuns",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "fictionalStories",
                title: "fictionalStories",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "educationalNuggets",
                title: "educationalNuggets",
                subscriptions: ["sourwood", "acacia"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Your Audience: Select your audience",
          placeholder: "Select",
          category: "onlineMedia",
          default: "none",
          values: {
            tag: "ion-select-option",
            options: [
              // Additional audience types

              {
                value: "newsletter",
                title: "Newsletter Audience",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "forum",
                title: "Forum Audience",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "blog",
                title: "Blog Audience",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "eCommerce",
                title: "eCommerce Audience",
                subscriptions: ["sourwood", "acacia"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Your Audience: Select your audience",
          placeholder: "Select",
          category: "inPersonMedia",
          default: "none",
          values: {
            tag: "ion-select-option",
            options: [
              // In-person audience types
              {
                value: "podcast",
                title: "Podcast Audience",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "conference",
                title: "Conference Attendees",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "workshop",
                title: "Workshop Participants",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "seminar",
                title: "Seminar Attendees",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "tradeShow",
                title: "Trade Show Visitors",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "networkingEvent",
                title: "Networking Event Attendees",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "communityGathering",
                title: "Community Gathering Participants",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "panelDiscussion",
                title: "Panel Discussion Attendees",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                value: "students",
                title: "Student Audience",
                subscriptions: ["sourwood", "acacia"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Value Proposition Document Formats: Select Your Audience",
          placeholder: "Select",
          category: "valuePropositionFormat",
          default: "none",
          values: {
            tag: "ion-select-option",
            options: [
              {
                title: "Tagline or Slogan",
                definition:
                  "A concise and catchy phrase that communicates the core value or key benefit of the offering. It aims to grab attention and create a memorable impression.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                title: "Elevator Pitch",
                definition:
                  "A brief and persuasive summary of the value proposition that can be delivered within the span of an elevator ride. It should capture the essence of the offering and generate interest quickly.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                title: "Value Proposition Statement",
                definition:
                  "A clear and concise statement that outlines the unique value the product or service provides to customers, emphasizing the problem it solves and the benefits it delivers. It usually includes the target customer, the offering's unique selling point, and the specific outcome or value it delivers.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                title: "Visual Representation",
                definition:
                  "Infographics, diagrams, or visual presentations that depict the value proposition in a visually appealing and easy-to-understand manner. This format can be especially effective for complex products or solutions.",
                subscriptions: ["premiere"],
              },
              {
                title: "Customer Testimonials",
                definition:
                  "Sharing testimonials or success stories from satisfied customers who have experienced the value of the offering. These testimonials highlight the benefits and positive outcomes customers have achieved through using the product or service.",
                subscriptions: ["sourwood", "acacia"],
              },
              {
                title: "Comparison Charts",
                definition:
                  "Visual representations that compare the offering against competitors or alternative solutions, highlighting the advantages and superior value it provides.",
                subscriptions: ["premiere"],
              },

              {
                title: "Video Presentations",
                definition:
                  "Short videos that effectively communicate the value proposition, combining visual elements, storytelling, and key messages to engage and persuade the audience.",
                subscriptions: ["premiere"],
              },
              {
                title: "Interactive Demonstrations",
                definition:
                  "Interactive experiences or prototypes that allow potential customers to directly interact with the offering and experience its value firsthand.",
                subscriptions: ["premiere"],
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Academic Document Formats: Select Your Audience",
          placeholder: "Select",
          category: "academicFormats",
          default: "none",
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "researchPapers",
                title: "Case Studies",
                definition:
                  "Academic research papers present original research findings, methodologies, and analysis on a specific topic.",
                subscriptions: ["acacia"],
              },
              {
                value: "reviewArticles",
                title: "Case Studies",
                definition:
                  "Review articles provide a comprehensive overview and analysis of existing research and literature on a particular topic.",
                subscriptions: ["acacia"],
              },

              {
                value: "thesesAndDissertations",
                title: "Theses and Dissertations",
                definition:
                  "Theses and dissertations are formal documents submitted by students to fulfill the requirements of an academic degree.",
                subscriptions: ["acacia"],
              },
              {
                value: "conferencePapers",
                title: "Conference Papers",
                definition:
                  "Conference papers are documents prepared for presentation at academic conferences or symposiums.",
                subscriptions: ["acacia"],
              },
              {
                value: "literatureReviews",
                title: "Literature Reviews",
                definition:
                  "Literature reviews summarize and analyze existing research and publications on a particular topic.",
                subscriptions: ["acacia"],
              },
              {
                value: "abstracts",
                title: "Abstracts",
                definition:
                  "Abstracts are concise summaries of a research paper, conference presentation, or article.",
                subscriptions: ["acacia"],
              },
              {
                value: "academicEssays",
                title: "Academic Essays",
                definition:
                  "Academic essays are shorter written compositions that present arguments or analyses on a specific topic.",
                subscriptions: ["acacia"],
              },
            ],
          },
        },
      ],
    },
  ],
};

const valuePropositionFormats = {
  "Tagline or Slogan": {
    definition:
      "A concise and catchy phrase that communicates the core value or key benefit of the offering. It aims to grab attention and create a memorable impression.",
    prompt:
      "Please provide a tagline or slogan that effectively communicates the core value or key benefit of the offering.",
  },
  "Elevator Pitch": {
    definition:
      "A brief and persuasive summary of the value proposition that can be delivered within the span of an elevator ride. It should capture the essence of the offering and generate interest quickly.",
    prompt:
      "Please provide an elevator pitch that delivers a brief and persuasive summary of the value proposition within the span of an elevator ride.",
  },
  "Value Proposition Statement": {
    definition:
      "A clear and concise statement that outlines the unique value the product or service provides to customers, emphasizing the problem it solves and the benefits it delivers. It usually includes the target customer, the offering's unique selling point, and the specific outcome or value it delivers.",
    prompt:
      "Please provide a value proposition statement that clearly and concisely outlines the unique value your product or service provides to customers, emphasizing the problem it solves and the benefits it delivers.",
  },
  "Visual Representation": {
    definition:
      "Infographics, diagrams, or visual presentations that depict the value proposition in a visually appealing and easy-to-understand manner. This format can be especially effective for complex products or solutions.",
    prompt:
      "Please provide a visual representation, such as an infographic or diagram, that effectively depicts the value proposition in a visually appealing and easy-to-understand manner.",
  },
  "Customer Testimonials": {
    definition:
      "Sharing testimonials or success stories from satisfied customers who have experienced the value of the offering. These testimonials highlight the benefits and positive outcomes customers have achieved through using the product or service.",
    prompt:
      "Please provide customer testimonials or success stories from satisfied customers who have experienced the value of the offering, highlighting the benefits and positive outcomes they have achieved.",
  },
  "Comparison Charts": {
    definition:
      "Visual representations that compare the offering against competitors or alternative solutions, highlighting the advantages and superior value it provides.",
    prompt:
      "Please provide a comparison chart that visually highlights the advantages and superior value of the offering compared to competitors or alternative solutions.",
  },
  "Case Studies": {
    definition:
      "In-depth narratives or reports that showcase real-life examples of how the offering solved a customer's problem or delivered significant value. Case studies provide detailed information on the customer's situation, the challenges they faced, and the measurable results achieved with the product or service.",
    prompt:
      "Please provide a case study that showcases a real-life example of how the offering solved a customer's problem or delivered significant value. Include detailed information on the customer's situation, the challenges they faced, and the measurable results achieved with the product or service.",
  },
  "Video Presentations": {
    definition:
      "Short videos that effectively communicate the value proposition, combining visual elements, storytelling, and key messages to engage and persuade the audience.",
    prompt:
      "Please provide a video presentation that effectively communicates the value proposition, combining visual elements, storytelling, and key messages to engage and persuade the audience.",
  },
  "Interactive Demonstrations": {
    definition:
      "Interactive experiences or prototypes that allow potential customers to directly interact with the offering and experience its value firsthand.",
    prompt:
      "Please provide an interactive demonstration or prototype that allows potential customers to directly interact with the offering and experience its value firsthand.",
  },
};

const academicFormats = {
  "Research Papers": {
    definition:
      "Academic research papers present original research findings, methodologies, and analysis on a specific topic.",
    prompt:
      "Please provide a research paper that presents original research findings, methodologies, and analysis on a specific topic.",
  },
  "Review Articles": {
    definition:
      "Review articles provide a comprehensive overview and analysis of existing research and literature on a particular topic.",
    prompt:
      "Please provide a review article that offers a comprehensive overview and analysis of existing research and literature on a particular topic.",
  },
  "Case Studies": {
    definition:
      "Academic case studies analyze a particular individual, organization, event, or phenomenon in depth.",
    prompt:
      "Please provide an academic case study that analyzes a particular individual, organization, event, or phenomenon in depth.",
  },
  "Theses and Dissertations": {
    definition:
      "Theses and dissertations are formal documents submitted by students to fulfill the requirements of an academic degree.",
    prompt:
      "Please provide a thesis or dissertation that meets the formal requirements for an academic degree.",
  },
  "Conference Papers": {
    definition:
      "Conference papers are documents prepared for presentation at academic conferences or symposiums.",
    prompt:
      "Please provide a conference paper that has been prepared for presentation at an academic conference or symposium.",
  },
  "Literature Reviews": {
    definition:
      "Literature reviews summarize and analyze existing research and publications on a particular topic.",
    prompt:
      "Please provide a literature review that summarizes and analyzes existing research and publications on a particular topic.",
  },
  Abstracts: {
    definition:
      "Abstracts are concise summaries of a research paper, conference presentation, or article.",
    prompt:
      "Please provide an abstract that serves as a concise summary of a research paper, conference presentation, or article.",
  },
  "Academic Essays": {
    definition:
      "Academic essays are shorter written compositions that present arguments or analyses on a specific topic.",
    prompt:
      "Please provide an academic essay that presents arguments or analyses on a specific topic.",
  },
};
