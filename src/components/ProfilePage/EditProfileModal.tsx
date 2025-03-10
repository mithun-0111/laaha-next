import editUserReducer, { initialEditState, loggedInUserDetails } from '@/src/app/[locale]/forum-user-dashboard/editUserReducer'
import React, { useEffect, useReducer } from 'react'
import EditProfile from './EditProfile';
import { getAvatars, getStepThreeFormDetails, getStepTwoFormDetails } from '@/src/app/[locale]/community-conversations/api';
import { useLocale } from 'next-intl';
import { useSignUp } from '@/src/contexts/SignUpProvider';
import { getUserInfo } from '@/src/lib/apis';
import { getAccessToken } from '@/src/lib/protectedAuth';

const EditProfileModal = ({ modalActive }: { modalActive: any }) => {
  const { userId } = useSignUp();
  const [editState, dispatch] = useReducer(editUserReducer, initialEditState);
  const locale = useLocale();

  const handleUserDetails = (loggedInUserDetails: loggedInUserDetails) => {
    dispatch({ type: "SET_LOGGED_IN_USER_DETAILS", loggedInUserDetails })
  }

  const handleProfileStep = (currentProfileStep: string) => {
    dispatch({ type: "SET_CURRENT_PROFILE_STEP", currentProfileStep })
  }

  useEffect(() => {
    getAvatars(locale).then(res => {
      dispatch({ type: "SET_AVATARS", avatars: res })
    });

    getStepTwoFormDetails(locale).then(res => {
      dispatch({ type: "SET_STEP_TWO_FORM_DETAILS", stepOneFormDetails: res })
    });

    getStepThreeFormDetails(locale).then(res => {
      dispatch({ type: "SET_STEP_THREE_FORM_DETAILS", stepTwoFormDetails: res })
    });

    getUserInfo(userId).then(
      (data) => {
        handleUserDetails({ nickname: data?.name, avatarUrl: data?.avatar.url })
        let securityQuestion = data?.security_question?.question
        let securityAnswer = data.answer

        dispatch({ type: 'SET_SELECTED_SECURITY_QUESTION', selectedSecurityQuestion: securityQuestion })
        dispatch({ type: 'SET_SECURITY_ANSWER', securityAnswer })
      }
    )
  }, []);

  return (
    <div className="edit-form fixed inset-0 bg-default-black bg-opacity-50 flex items-end md:items-center md:justify-center md:p-4 z-20">
      <div className="bg-white container p-0 rounded-lg overflow-hidden h-fit relative">
        <EditProfile
          editState={editState}
          currentProfileStep={editState?.currentProfileStep}
          loggedInUserDetails={editState?.loggedInUserDetails}
          editYourProfileSteps={editState?.editYourProfileSteps}
          handleUserDetails={handleUserDetails}
          handleProfileStep={handleProfileStep}
          securityQuestions={editState?.securityQuestions}
          dispatch={dispatch}
          modalActive={modalActive}
        />
        <div onClick={() => modalActive(false)} className='close cursor-pointer underline text-m absolute right-6 top-4'>Close</div>
      </div>
    </div>
  )
}

export default EditProfileModal
