import React, { useState } from "react";
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Button,
  Popup,
  Header,
  Modal,
} from "semantic-ui-react";
import Link from "next/link";
import PostComments from "./PostComments";
import CommentInput from "./CommentInput";
import calculateTime from "../../utils/calculateTime";

function CardPost({ post, user, setPosts, setShowToastr }) {
  const [likes, setLikes] = useState(post.likes);
  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;
  const [comments, setComments] = useState(post.comments);
  const [error, setError] = useState(null);
  const [load, setload] = useState(true);

  setTimeout(() => {
    setload(false);
  }, 1000);

  return (
    <>
      <Segment loading={load} stacked>
        <Card color="teal" fluid>
          {post.picUrl && (
            <Image
              src={post.picUrl}
              wrapped
              ui={false}
              alt="postimage"
              floated="left"
              style={{ cursor: "pointer" }}
            />
          )}
          <Card.Content>
            <Image
              floated="left"
              src={post.user.profilePicUrl}
              avatar
              circular
            />

            {(user.role === "root" || post.user._id === user._id) && (
              <>
                <Popup
                  on="click"
                  position="top right"
                  trigger={
                    <Image
                      src="/deleteIcon.svg"
                      style={{ cursor: "pointer" }}
                      size="mini"
                      floated="right"
                    />
                  }
                >
                  <Header as="h6" content="مطمئنی میخوای حذفش کنی؟" />

                  <Button color="red" icon="trash" content="Delete" />
                </Popup>
              </>
            )}

            <Card.Header>
              <Link href={`/${post.user.username}`}>
                <a>{post.user.name}</a>
              </Link>
            </Card.Header>

            <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

            {post.location && <Card.Meta content={post.location} />}

            <Card.Description
              style={{
                fontSize: "17px",
                letterSpacing: "0.1px",
                wordSpacing: "0.35px",
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Icon
              name={isLiked ? "heart" : "heart outline"}
              color="red"
              style={{ cursor: "pointer" }}
              onClick={() =>
                likePost(post._id, user._id, setLikes, isLiked ? false : true)
              }
            />

            {likes.length > 0 && (
              <span className="spanLikesList">
                {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
              </span>
            )}

            <Icon
              name="comment outline"
              style={{ marginLeft: "7px" }}
              color="blue"
            />

            <Divider horizontal />

            {comments.length > 0 &&
              comments.map(
                (comment, i) =>
                  i < 3 && (
                    <PostComments
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  )
              )}

            {comments.length > 3 && (
              <Button content="View More" color="teal" basic circular />
            )}

            <Divider hidden />

            <CommentInput
              user={user}
              postId={post._id}
              setComments={setComments}
            />
          </Card.Content>
        </Card>
      </Segment>
    </>
  );
}

export default CardPost;
