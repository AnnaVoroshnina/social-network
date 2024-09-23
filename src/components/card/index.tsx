import { Card as NextUiCard, CardBody, CardFooter, CardHeader, Spinner } from "@nextui-org/react"
import { useLikePostMutation, useUnlikePostMutation } from "../../app/services/likeApi"
import { useDeletePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery } from "../../app/services/postApi"
import { useDeleteCommentMutation } from "../../app/services/commentApi"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { selectCurrent } from "../../features/user/userSlice"
import { User } from "../user"
import { formatToClientDate } from "../../utils/format-to-client-date"
import { RiDeleteBinLine } from "react-icons/ri"

import { MetaInfo } from "../meta-info"
import { FcDislike } from "react-icons/fc"
import { MdOutlineFavoriteBorder } from "react-icons/md"
import { FaRegComment } from "react-icons/fa"
import { ErrorMessage } from "../error-message"
import { Typography } from "../typography"
import { useSelector } from "react-redux"
import { hasErrorField } from "../../utils/has-error-field"

type Props = {
  avatarUrl: string
  name: string
  authorId: string
  content: string
  commentId?: string
  likesCount?: number
  commentsCount?: number
  createdAt?: Date
  id?: string
  cardFor: "comment" | "post" | "current-post"
  likedByUser?: boolean
}

export const Card = ({
                       avatarUrl = "",
                       name = "",
                       content = "",
                       authorId = "",
                       id = "",
                       likesCount = 0,
                       commentsCount = 0,
                       cardFor = "post",
                       likedByUser = false,
                       createdAt,
                       commentId = ""
                     }: Props) => {
  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const [triggerGetAllPost] = useLazyGetAllPostsQuery()
  const [triggerGetPostBuId] = useLazyGetPostByIdQuery()
  const [deletePost, deletePostStatus] = useDeletePostMutation()
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrent)

  const handleClick = async () => {
    try {
      likedByUser
        ? await unlikePost(id).unwrap()
        : await likePost({ postId: id }).unwrap()
      if (cardFor === 'current-post') {
        await triggerGetPostBuId(id).unwrap()
      }
      if (cardFor === 'post') {
        await triggerGetAllPost().unwrap()
      }
    } catch (err) {
      if (hasErrorField(err)) {
        setError(err.data.error)
      } else setError(err as string)
    }
  }

  const refetchPosts = async () => {
    switch (cardFor) {
      case "post":
        await triggerGetAllPost().unwrap()
        break
      case "current-post":
        await triggerGetAllPost().unwrap()
        break
      case "comment":
        await triggerGetPostBuId(id).unwrap()
        break
      default:
        throw new Error("Неверный аргумент CardFor")
    }
  }
  const handleDelete = async () => {
    try {
      switch (cardFor) {
        case "comment":
          await deleteComment(commentId).unwrap()
          await refetchPosts()
          break
        case "post":
          await deletePost(id).unwrap()
          await refetchPosts()
          break
        case "current-post":
          await deletePost(id).unwrap()
          await navigate("/")
          break
        default:
          throw new Error("Неверный аргумент CardFor")
      }
    } catch (err) {
      if (hasErrorField(err)) {
        setError(err.data.error)
      } else setError(err as string)

    }
  }

  return (
    <NextUiCard className="min-w-[320px] mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link to={`/users/${authorId}`}>
          <User
            name={name}
            className="text-small font-semibold leading-none text-default-600"
            avatarUrl={avatarUrl}
            description={createdAt && formatToClientDate(createdAt)}
          />
        </Link>
        {authorId === currentUser?.id && (
          <div className="cursor-pointer" onClick={handleDelete}>
            {deletePostStatus.isLoading || deleteCommentStatus.isLoading
              ? <Spinner />
              : <RiDeleteBinLine />
            }
          </div>
        )}
      </CardHeader>
      <CardBody className="px-3 p-y-2 mb-5">
        <Typography>{content}</Typography>
      </CardBody>
      {cardFor !== "comment" && (
        <CardFooter className="gap-3">
          <div className="flex gap-5 item-center">
            <div onClick={handleClick}>
              <MetaInfo
                count={likesCount}
                Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
              />
            </div>
            <Link to={`/posts/${id}`}>
              <MetaInfo
                count={commentsCount}
                Icon={FaRegComment} />
            </Link>
          </div>
          <ErrorMessage error={error} />
        </CardFooter>
      )}
    </NextUiCard>
  )
}