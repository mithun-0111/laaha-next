const completeYourProfileStepsMap = new Map([
  ["STEP_1", "Generate your random username"],
  ["STEP_2", "Set your password and confirm it"],
  ["STEP_3", "Set a security question to reset your password later"],
  ["STEP_4", "Create your avatar as your profile picture"],
  ["STEP_5", "Accept Laaha community guidelines to get started!"],
])

export interface UserDetails {
  nickname: string
  avatarUrl: string
  password: string
}

export interface InitialStateProps {
  signInFormDetails: Object
  stepOneFormDetails: Object
  stepTwoFormDetails: Object
  stepThreeFormDetails: Object
  stepFourAvatarFormDetails: Object
  stepFiveCommunityGuidelines: Object
  screens: string[]
  securityQuestions: string[]
  selectedSecurityQuestion: string
  securityAnswer: string
  currentScreen: string
  completeYourProfileSteps: Map<string, string>
  currentProfileStep: string
  userDetails: UserDetails
  acceptTerms: boolean
}

export const initialState: InitialStateProps = {
  signInFormDetails: {
    community_info_header: "Welcome to LAAHA",
    community_info_description: "Join our community to participate in discussions",
    anonymous_button_text: "Continue as Anonymous",
    login_instruction: "Please enter your login details",
    forgot_password_link: "/user/password/reset",
  },
  stepOneFormDetails: {
    header: "User Name",
    title: "Enter Nickname",
    help_text:
      "Make sure to not add your actual name. Pick one of the options below or write your own.",
    pick_one_text: "Or Pick one",
    usernames: [""],
  },
  stepTwoFormDetails: {
    header: "Password",
    policy1: "At least 4-16 characters long",
    policy2: "Have at least one number",
    example_pass: "For example: flower5",
  },
  stepThreeFormDetails: {
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
  stepFourAvatarFormDetails: {
    header: "Avatar",
    description: "Choose your avatar.",
    avatar_images: [],
  },
  stepFiveCommunityGuidelines: {
    header: "Community Guideliness",
    description:
      "Read our guidelines and accept the LAAHA Community - Community Guidelines",
    video_url: "https://example.com/path/to/guidelines-video.mp4",
    accept_guidelines_check:
      "I accept the LAAHA Community - Community Guidelines",
    accept_guide_description:
      "Please click here to confirm you read the guidelines.",
  },
  screens: ["signup-or-signin", "register-a-user"],
  securityQuestions: [],
  selectedSecurityQuestion: "",
  securityAnswer: "",
  currentScreen: "signup-or-signin",
  completeYourProfileSteps: completeYourProfileStepsMap,
  currentProfileStep: "STEP_1",
  userDetails: {
    nickname: "",
    avatarUrl: "",
    password: "",
  },
  acceptTerms: false,
}

// Reducer function to handle state updates based on actions
export default function signupReducer(state: any, action: any) {
  switch (action.type) {
    case "CLOSE_MODAL":
      // Close the modal
      return {
        ...state,
        showModal: false,
      }
    case "SET_SCREEN":
      // Set the current screen (signup or register)
      return {
        ...state,
        currentScreen: action.screen,
      }
    case "SET_USER_DETAILS":
      // Set user details in the state
      return {
        ...state,
        userDetails: action.userDetails,
      }
    case "SET_CURRENT_PROFILE_STEP":
      // Set the current profile step
      return {
        ...state,
        currentProfileStep: action.currentProfileStep,
      }
    case "SET_SELECTED_SECURITY_QUESTION":
      // Set selected security question
      return {
        ...state,
        selectedSecurityQuestion: action.selectedSecurityQuestion,
      }
    case "SET_SECURITY_ANSWER":
      // Set security question answer
      return {
        ...state,
        securityAnswer: action.securityAnswer,
      }
    case "SET_ACCEPT_TERMS":
      // Set acceptance of terms
      return {
        ...state,
        acceptTerms: action.acceptTerms,
      }
    case "SET_LOGIN_FORM_DETAILS":
      // Set login form details (like instructions, links)
      return {
        ...state,
        signInFormDetails: action.signInFormDetails,
      }
    case "SET_STEP_ONE_FORM_DETAILS":
      // Set step one (nickname) form details
      return {
        ...state,
        stepOneFormDetails: action.stepOneFormDetails,
      }
    case "SET_STEP_TWO_FORM_DETAILS":
      // Set step two (password) form details
      return {
        ...state,
        stepTwoFormDetails: action.stepTwoFormDetails,
      }
    case "SET_STEP_THREE_FORM_DETAILS":
      // Set step three (security question) form details
      let questions: string[] = []
      Object.entries(action.stepThreeFormDetails.security_questions).forEach(
        ([key, value]) => {
          if (key !== "") {
            questions.push(String(value))
          }
        }
      )
      return {
        ...state,
        securityQuestions: questions,
        stepThreeFormDetails: action.stepThreeFormDetails,
      }
    case "SET_AVATARS":
      // Set avatars for profile picture selection
      return {
        ...state,
        stepFourAvatarFormDetails: action.avatars,
      }
    case "SET_COMMUNITY_GUIDELINES":
      // Set community guidelines (acceptance and video)
      return {
        ...state,
        stepFiveCommunityGuidelines: action.communityGuidelines,
      }
    case "RESET":
      // Reset the state to initial values
      return initialState
  }
}
