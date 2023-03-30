import React, { useEffect, useState, useContext } from "react"
import { useParams, Link, withRouter } from "react-router-dom"
import Axios from "axios"
import Page from "./page"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPosts] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        setPosts(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem or request was cancelled.")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [id])
  if (!isLoading && !post) {
    return <NotFound />
  }
  if (isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )
  }
  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}}`
  function isOwner() {
    if (appState.logged) {
      return appState.user.username == post.author.username
    }
    return false
  }
  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this Post")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data == "Success") {
          // Display a flash message
          appDispatch({ type: "flashMessage", value: "Post was successfully deleted" })
          //Redirect to user's profile
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (error) {
        console.log("There was a problem in delete handler")
      }
    }
  }
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}> {post.author.username} </Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)
