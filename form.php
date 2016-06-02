<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
?>{
  "questions": [
    {
      "id": 0,
      "type": "Group",
      "title": "Basic Information"
    },
    {
      "id": 1,
      "type": "ShortText",
      "question_instruction":  "What is your name?",
      "validations": [
        {
          "type": "isRequired"
        },
        {
          "type": "minLength",
          "value": 2
        },
        {
          "type": "maxLength",
          "value": 20
        }
      ],
      "group": 0
    },
    {
      "id": 2,
      "type": "Email",
      "question_instruction": "What is your email?",
      "question_description": "Please enter your work email",
      "placeholder_text": "@work.com.au",
      "attachment": {
        "type": "Image",
        "src":  "http://public_image_src.com"
      },
      "validations": [
        {
          "type": "isRequired"
        }
      ],
      "verifications": [
        "EmondoEmailService"
      ],
      "group": 0
    },
    {
      "id": 3,
      "type": "ShortText",
      "question_instruction": "Hi {{answer_1}} How old are you?",
      "validations": [
        {
          "type": "isRequired"
        }
      ],
      "group": 0
    },
    {
      "id": 4,
      "type": "ShortText",
      "question_instruction": "You only see this question if you are older than 20",
      "group": 0
    },
    {
      "question_instruction": "What is the value of your savings and investments?",
      "type": "MultipleChoice",
      "choices": [
        {
          "label": "A",
          "text": "$1,000,000+"
        },
        {
          "label": "B",
          "text": "$200k - 900k"
        }
      ],
      "validations": [
        {
          "type": "isRequired"
        }
      ],
      "group": 0
    }
  ],
  "logics": [
    {
      "conditions": [
        {
          "id": 1,
          "source_field": 3,
          "condition_name": "greater_than" ,
          "value": 20
        },
        {
          "id": 2,
          "source_field": 4,
          "source_condition": 1,
          "condition_logic": "AND",
          "condition_name": "greater_than",
          "value": 20
        },
        {
          "source_fields": 4,
          "source_condition": 2,
          "condition_logic": "OR",
          "condition_name": "greater_than",
          "value": 20
        }
      ],
      "outcome": {
        "type": "JumpToQuestion",
        "value": 4
      }
    }
  ]
}
