import axios from "axios"
import { getCountryCode, getLangCode, getLocaleValue } from "./utils"
import { getAccessToken } from "./protectedAuth"

const BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
const countryCode = getCountryCode()
const langCode = getLangCode()
const localeValue = getLocaleValue()

export const getContentCurationData = async (
  id: string,
  locale: string,
  pageNumber: number,
  filterType: string,
  sortBy: string
) => {
  try {
    // Check if categoryList exists in localStorage
    const cachedCategoryList = localStorage.getItem("categoryList");

    let categoryList;
    if (cachedCategoryList) {
      // Use the cached categoryList from localStorage
      categoryList = JSON.parse(cachedCategoryList);
    } else {
      // Fetch categoryList from the API
      const subcatData = await fetch(
        `${BASE_URL}/${locale}/api/v1/hierarchical-terms/categories`,
        {
          headers: {
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
          },
        }
      );
      categoryList = await subcatData.json();

      // Store the fetched categoryList in localStorage
      localStorage.setItem("categoryList", JSON.stringify(categoryList));
    }

    // Fetch content curation data
    const response = await fetch(
      `${BASE_URL}/${locale}/api/v1/content_curation/${id}?page=${pageNumber}${
        filterType ? `&type=${filterType}` : ""
      }&sort_bef_combine=${sortBy}`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
        },
      }
    );
    const data = await response.json();

    return { data, categoryList };
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export const fetchIDFromPath = async (name:string, locale:string) => {
  const response = await fetch(
    `${BASE_URL}/${locale}/api/v1/tags-by-name/${name}`,
    {
      headers: {
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
      },
    }
  );
  const id = await response.json();
  return id;
}

export const getContentCurationTopData = async (name:string, locale: string) => {
  try {
    const apiUrl = `${BASE_URL}/${locale}/api/v1/content_curation_term_block/${name}`;
    const response = await fetch(apiUrl, {
      headers: {
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON data
    const result = await response.json();
    return result;
  } catch(error) {
    console.log('Error: Fetching the results');
  }
}

export const getResourceData = async (
  locale: string,
  catID: any,
  pageNumber: number,
  filterType: string,
  sortBy: string,
  searchParam: string
) => {
  try {
    // Check if categoryList exists in localStorage
    const cachedCategoryList = localStorage.getItem("categoryList");

    let categoryList;
    if (cachedCategoryList) {
      // Use the cached categoryList from localStorage
      categoryList = JSON.parse(cachedCategoryList);
    } else {
      // Fetch categoryList from the API
      const subcatData = await fetch(
        `${BASE_URL}/${locale}/api/v1/hierarchical-terms/categories`,
        {
          headers: {
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
          },
        }
      );
      categoryList = await subcatData.json();

      // Store the fetched categoryList in localStorage
      localStorage.setItem("categoryList", JSON.stringify(categoryList));
    }

    const validCatIDs = catID.filter((id: any) => id)
    const categoryParam = validCatIDs.length > 0 ? validCatIDs.join("+") : ""

    const response = await fetch(
      `${BASE_URL}/${locale}/api/v1/resources/?${searchParam ? `search=${searchParam}` : ""}${categoryParam ? `&category=${categoryParam}` : `&category=all`}&page=${pageNumber}${filterType ? `&type=${filterType}` : ""}&sort_bef_combine=${sortBy}`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
        },
      }
    )
    const data = await response.json()
    return { data, categoryList }
  } catch (error) {
    console.error(error)
  }
}

export const getCategoriesData = async (locale: string, tid: number) => {
  try {
    const res = await fetch(
      `${BASE_URL}/${locale}/api/v1/related-subcategories/term/${tid}`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
        },
      }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

// Community related API's.

export const getSubCategory = async (catID: any) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/subcategory?categoryID=${catID}`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching resources with parameters:", error)
    throw error
  }
}

// Function to get resources with multiple query parameters
export const getQuestionData = async (
  locale: string,
  searchParam: string,
  category: number,
  subcategory: string,
  selectedTab: string,
  pageNumber: number,
  pageLimit: number,
  accessToken: string | null
) => {
  try {
    if (accessToken) {
      const response = await axios.get(
        `${BASE_URL}/${locale}/api/v1/question-list?search=${searchParam}&category=${category}&subcategory=${subcategory}&selectedTab=${selectedTab}&page=${pageNumber}&limit=${pageLimit}`,
        {
          headers: {
            "Content-Type": "application/json",
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } else {
      const response = await axios.get(
        `${BASE_URL}/${locale}/api/v1/question-list?search=${searchParam}&category=${category}&subcategory=${subcategory}&selectedTab=${selectedTab}&page=${pageNumber}&limit=${pageLimit}`,
        {
          headers: {
            "Content-Type": "application/json",
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
          },
        }
      )
      return response.data
    }
  } catch (error) {
    console.error("Error fetching resources with parameters:", error)
    throw error
  }
}

export const getGeneralData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/general`)
    return response.data
  } catch (error) {
    console.error("Error fetching resources with parameters:", error)
    throw error
  }
}

interface PostReactionResponse {
  data: any
  status: number
  statusText: string
}

export const PostReaction = async (
  reactionType: string,
  resourceId: string,
  resourceType: string,
): Promise<PostReactionResponse> => {
  const data = {
    entity_id: resourceId,
    entity_type: resourceType,
    reaction: reactionType,
  }
  let accessToken = await getAccessToken();
  try {
    const response = await axios.post<PostReactionResponse>(
      `${BASE_URL}/api/v1/reaction`,
      data,
      {
        headers: {
          type: "text",
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error("Error creating resource:", error)
    throw error
  }
}

interface PostCommentData {
  resourceId: string
  resourceData: string
  moderationStatus: string
}

interface CommentResponse {
  data: any
  status: number
}

export const PostComment = async (
  resourceId: string,
  resourceData: string,
  moderationStatus: string,
  accessToken: string | null
) => {
  const data = {
    qid: resourceId,
    question: resourceData,
    moderation_status: moderationStatus,
    accept_terms_and_condition: true,
  }

  try {
    const response = await axios.post<CommentResponse>(
      `${BASE_URL}/api/v1/add/question`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response
  } catch (error) {
    console.error("Error creating resource:", error)
    throw error
  }
}

interface QuestionData {
  id: string
  title: string
  description: string
}

export const getIndividualQuestion = async (
  ID: string | number,
  accessToken: string | null
): Promise<QuestionData | any> => {
  try {
    if (accessToken) {
      const response = await axios.get(
        `${BASE_URL}/api/v1/question?questionID=${ID}`,
        {
          headers: {
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } else {
      const response = await axios.get(
        `${BASE_URL}/api/v1/question?questionID=${ID}`,
        {
          headers: {
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
          },
        }
      )
      return response.data
    }
  } catch (error: any) {
    console.error("Error fetching resources with parameters:", error)
    throw error
  }
}

//Individual question from question List.
export const getIndividualQuestionData = async (
  ID: string | number,
  accessToken: string | null
) => {
  try {
    if (accessToken) {
      const response = await axios.get(`${BASE_URL}/api/v1/question/${ID}`, {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } else {
      const response = await axios.get(`${BASE_URL}/api/v1/question/${ID}`, {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
        },
      })
      return response.data
    }
  } catch (error) {
    console.error("Error fetching resources with parameters:", error)
    throw error
  }
}

// Get User questions.
export const getUserQuestions = async (
  status: string,
  pageNumber: number,
  pageLimit: number,
  accessToken: string | ""
) => {
  try {
    const baseUrl = `${BASE_URL}/api/v1/question-list-profile?page=${pageNumber}&limit=${pageLimit}`
    const url = status
      ? `${BASE_URL}/api/v1/question-list-profile?status=${status}&page=${pageNumber}&limit=${pageLimit}`
      : baseUrl
    const response = await axios.get(url, {
      headers: {
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching resources with parameters:", error)
    throw error
  }
}

// Get User comments.
export const getUserComments = async (
  status: string,
  pageNumber: number,
  pageLimit: number,
  accessToken: string
) => {
  try {
    const baseUrl = `${BASE_URL}/api/v1/comment-list-profile?page=${pageNumber}&limit=${pageLimit}`
    const url = status
      ? `${BASE_URL}/api/v1/comment-list-profile?status=${status}&page=${pageNumber}&limit=${pageLimit}`
      : baseUrl
    const response = await axios.get(url, {
      headers: {
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching resources with parameters:", error)
    throw error
  }
}

export const updateComment = async (
  resourceData: any,
  resourceId: string,
  moderation_status: string,
  accessToken: string | null
) => {
  const data = {
    cid: resourceId,
    comment_body: resourceData,
    moderation_status: moderation_status,
    accept_terms_and_condition: true,
  }
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/edit/comment`, data, {
      headers: {
        type: "text",
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response
  } catch (error) {
    console.error("Error creating resource:", error)
    throw error
  }
}

export const getUserInfo = async (
  uid: string | null,
) => {
  let accessToken = await getAccessToken();

  try {
    const response = await axios.get(`${BASE_URL}/api/v1/user/${uid}`, {
      headers: {
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching resources with parameters:", error)
    throw error
  }
}

export const updateQuestion = async (
  resourceData: any,
  resourceId: string,
  moderation_status: string,
  accessToken: string | null
) => {
  // const token = await csrfToken();
  const data = {
    qid: resourceId,
    question: resourceData,
    moderation_status: moderation_status,
    accept_terms_and_condition: true,
  }
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/edit/question`,
      data,
      {
        headers: {
          type: "text",
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response
  } catch (error) {
    console.error("Error creating resource:", error)
    throw error
  }
}

export const fetchCategoriesData = async (locale: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/categories`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const fetchAskQuestionConfig = async (
  locale: string,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/ask-question-configuration`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const fetchCategoriesModeratorData = async (
  locale: string,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/moderator/categories`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getModerateQuestions = async (
  locale: string,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/moderated-questions/all`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getIndividualModerateQuestions = async (
  locale: string,
  qid: string | number,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/moderated-questions/${qid}`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getIndividualModerateReplies = async (
  locale: string,
  rid: string | number,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/moderated-replies/${rid}`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getReportedQuestionsData = async (
  locale: string,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/reported-questions`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getReportReasonsData = async (
  locale: string,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/webform_rest/report/elements`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getIndividualModerateReportedQues = async (
  locale: string,
  qID: string | number,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/reported-questions/${qID}`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getIndividualModerateReportedAns = async (
  locale: string,
  rID: string | number,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/reported-replies/${rID}`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getReportedRepliesData = async (
  locale: string,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/reported-replies`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getModerateRepliesData = async (
  locale: string,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/moderated-replies/all`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const getSensitiveWordsData = async (
  locale: string,
  accessToken: string | null
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${locale}/api/v1/sensitive-words`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export const PostReport = async (
  resourceId: string,
  reason: string,
  locale: string,
  entity_type: string,
  setShowMessage: React.Dispatch<React.SetStateAction<string>>,
) => {
  let accessToken = await getAccessToken();
  try {
    if (entity_type === "node") {
      const response = await fetch(
        `${BASE_URL}/${locale}/api/v1/report/submit`,
        {
          method: "POST",
          body: JSON.stringify({
            entity_type,
            entity_id: resourceId,
            report_category: reason,
          }),
          headers: {
            "Content-Type": "application/json",
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error("Error submitting report")
      }
      setShowMessage("Reported the question successfully!")
    }

    if (entity_type === "comment") {
      const response = await fetch(
        `${BASE_URL}/${locale}/api/v1/report_reply/submit`,
        {
          method: "POST",
          body: JSON.stringify({
            entity_type,
            entity_id: resourceId,
            report_category: reason,
          }),
          headers: {
            "Content-Type": "application/json",
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!response.ok) {
        console.error("Error submitting report")
      }
      setShowMessage("Reported the comment successfully!")
    }
  } catch (error) {
    console.error("Error submitting report:", error)
  }
}

export const PostDelete = async (
  resourceId: string,
  resource: string,
  locale: string,
  setShowMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  let accessToken = await getAccessToken();
  try {
    if (resource === "question") {
      const response = await fetch(
        `${BASE_URL}/${locale}/api/v1/delete/question`,
        {
          method: "POST",
          body: JSON.stringify({ qid: resourceId }),
          headers: {
            "Content-Type": "application/json",
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error("Error submitting report")
      }
      setShowMessage("Resource Deleted successfully!")
      setTimeout(() => {
        location.reload()
      }, 2000)
    }
    if (resource === "comment") {
      const response = await fetch(
        `${BASE_URL}/${locale}/api/v1/delete/comment`,
        {
          method: "POST",
          body: JSON.stringify({ comment_id: resourceId }),
          headers: {
            "Content-Type": "application/json",
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error("Error submitting report")
      }
      setShowMessage("Resource Deleted successfully!")
      setTimeout(() => {
        location.reload()
      }, 2000)
    }
  } catch (error) {
    console.error("Error submitting report:", error)
    alert("An error occurred while submitting the report.")
  }
}

export const PostModeratorAction = async (
  reason: string = "",
  category: string,
  dataType: string,
  action: string,
  ID: string,
  locale: string,
  uid: string,
) => {
  let accessToken = await getAccessToken()

  try {
    let bodyData = () => {
      if (action === "approve") {
        if (dataType === "question") {
          return {
            type: dataType,
            nid: ID,
            uid: uid,
            reason: reason,
            category: category,
          }
        } else {
          return {
            type: dataType,
            cid: ID,
            reason: reason,
          }
        }
      }
      if (action === "reject") {
        if (dataType === "question") {
          return {
            type: dataType,
            nid: ID,
            uid: uid,
            reason: reason,
          }
        } else {
          return {
            type: dataType,
            cid: ID,
            reason: reason,
          }
        }
      }
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/moderated-${action}-action`,
      {
        method: "POST",
        body: JSON.stringify(bodyData()),
        headers: {
          "Content-Type": "application/json",
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Error submitting report")
    }
    alert(
      `Resource ${action === "approve" ? "Approved" : "Rejected"} successfully!`
    )
    location.reload()
  } catch (error) {
    console.error("Error submitting report:", error)
    alert("An error occurred while submitting the report.")
  }
}

export const PostIgnoreResource = async (
  ID: string | null,
  dataType: string,
  userId: string
) => {
  let accessToken = await getAccessToken();

  const body = () => {
    if (dataType === "question") {
      return {
        nid: ID,
        type: dataType,
        uid: userId,
      }
    } else {
      return {
        cid: ID,
        type: dataType,
      }
    }
  }

  try {
    const response = await fetch(`${BASE_URL}/api/v1/reported-ignore-action`, {
      method: "POST",
      body: JSON.stringify(body()),
      headers: {
        "Content-Type": "application/json",
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error submitting report")
    }
    alert("Resource Ignored successfully!")
    location.reload()
  } catch (error) {
    console.error("Error submitting report:", error)
    alert("An error occurred while submitting the report.")
  }
}

export const PostUnPublishResource = async (
  ID: string | null,
  dataType: string,
  reason: string,
  uid: string,
) => {
  let accessToken = await getAccessToken();

  const body = () => {
    if (dataType === "question") {
      return {
        type: dataType,
        nid: ID,
        uid: uid,
        reason: reason,
      }
    } else {
      return {
        type: dataType,
        cid: ID,
        reason: reason,
      }
    }
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/reported-unpublish-action`,
      {
        method: "POST",
        body: JSON.stringify(body()),
        headers: {
          "Content-Type": "application/json",
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    if (!response.ok) {
      throw new Error("Error submitting report")
    }
    alert("Resource Unpublished successfully!")
    location.reload()
  } catch (error) {
    console.error("Error submitting report:", error)
  }
}

interface SecurityQuestionData {
  username: string
  securityQuestion: string
  answer: string
}

export const validateSecurityQuestion = async (data: SecurityQuestionData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/forgot-password-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    // Check if response was successful
    if (response.ok && result.success) {
      return { success: true }
    } else {
      return {
        success: false,
        message: result.message,
        uid: result.uid || "Invalid answer or username.",
      }
    }
  } catch (error) {
    console.error("Error during API call:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export const changePassword = async (data: {
  password: string
  uid: string
}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/update-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, message: "Password changed successfully" }
    } else {
      return {
        success: false,
        message: result.message || "Failed to change password",
      }
    }
  } catch (error) {
    console.error("Error during password change:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export const HomeDynamic = async (locale:string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/home_dynamic`,
    {
      headers: {
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: locale || "en",
      },
    }
  )
  const jsonRes = await response.json()

  return jsonRes;
}
