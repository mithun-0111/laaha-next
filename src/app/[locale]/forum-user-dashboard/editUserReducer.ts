// Map defining the steps in the profile editing process
const editYourProfileStepsMap = new Map([
  ["STEP_1", "Update your password and confirm it"],
  ["STEP_2", "Update your security question to reset your password later"],
  ["STEP_3", "Update your avatar as your profile picture"],
])

// Interface for the logged-in user details
export interface loggedInUserDetails {
  nickname: string
  avatarUrl: string
  password?: string
}

// Interface defining the structure of the state for profile editing
export interface InitialStateProps {
  stepOneFormDetails: Object
  stepTwoFormDetails: Object
  stepThreeAvatarFormDetails: Object
  securityQuestions: string[] // List of security questions
  selectedSecurityQuestion: string // Selected security question
  editYourProfileSteps: Map<string, string> // Steps in the profile editing process
  securityAnswer: string // Answer to the selected security question
  currentProfileStep: string // The current step in profile editing
  loggedInUserDetails: loggedInUserDetails // Logged-in user details
  acceptTerms: boolean // Whether terms are accepted
}

// Initial state for the profile editing process
export const initialEditState: InitialStateProps = {
  stepOneFormDetails: {
    header: "New Password",
    policy1: "At least 4-16 characters long",
    policy2: "Have at least one number",
    example_pass: "For example: flower5",
  },
  stepTwoFormDetails: {
    header: "Security Questions",
    sq_description_above:
      "This Question will help you to sign in even if you forgot the password",
    sq_label: "Security Question",
    sq_description_below:
      "Know that the security question and answer you pick will help you get back into your account if you forget your username or password. Make sure to choose something you'll remember.",
    security_questions: {
      null: "Please select a Question",
      "1": "What was your first pet's name?",
      "2": "What is your mother's maiden name?",
      "3": "What city were you born in?",
    },
    answer_label: "",
  },
  stepThreeAvatarFormDetails: {
    header: "Avatar",
    description: "Choose your avatar.",
    avatar_images: [],
  },
  securityQuestions: [
    "What was your first pet's name?",
    "What is your mother's maiden name?",
    "What city were you born in?",
  ],
  selectedSecurityQuestion: "", // Default to no security question selected
  securityAnswer: "", // Default to no answer provided
  editYourProfileSteps: editYourProfileStepsMap, // Steps map
  currentProfileStep: "STEP_1", // Default to step 1
  loggedInUserDetails: {
    nickname: "",
    avatarUrl: "",
    password: "",
  },
  acceptTerms: true, // Default to terms accepted
}

// Reducer function to manage state updates based on actions
export default function editUserReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_LOGGED_IN_USER_DETAILS":
      return {
        ...state,
        loggedInUserDetails: action.loggedInUserDetails, // Update user details
      }
    case "SET_CURRENT_PROFILE_STEP":
      return {
        ...state,
        currentProfileStep: action.currentProfileStep, // Update current profile step
      }
    case "SET_SELECTED_SECURITY_QUESTION":
      return {
        ...state,
        selectedSecurityQuestion: action.selectedSecurityQuestion, // Update selected security question
      }
    case "SET_STEP_TWO_FORM_DETAILS":
      return {
        ...state,
        stepOneFormDetails: action.stepOneFormDetails, // Update step one form details
      }
    case "SET_STEP_THREE_FORM_DETAILS":
      let questions: string[] = []
      // Extract security questions and add to array
      Object.entries(action.stepTwoFormDetails.security_questions).forEach(
        ([key, value]) => {
          if (key !== "") {
            questions.push(String(value))
          }
        }
      )
      return {
        ...state,
        securityQuestions: questions, // Update security questions
        stepTwoFormDetails: action.stepTwoFormDetails, // Update step two form details
      }
    case "SET_SECURITY_ANSWER":
      return {
        ...state,
        securityAnswer: action.securityAnswer, // Update security answer
      }
    case "SET_AVATARS":
      return {
        ...state,
        stepThreeAvatarFormDetails: action.avatars, // Update avatar images
      }
    case "RESET":
      return initialEditState // Reset to the initial state
  }
}
