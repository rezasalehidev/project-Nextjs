import React, { useState } from "react";
import { Button, Comment, Form, Header, Icon } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function PostComments({ comment, user, setComments, postId }) {
  const [disabled, setDisabled] = useState(false);

  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar src={comment.user.profilePicUrl} />
        <Comment.Content>
          <Comment.Author as="a" href={`/${comment.user.username}`}>
            {comment.user.name}
          </Comment.Author>
          <Comment.Metadata>
            <div>{calculateTime(comment.date)}</div>
          </Comment.Metadata>
          <Comment.Text>{comment.text}</Comment.Text>
          <Comment.Actions>
            <Comment.Action>
              {(user.role === "root" || comment.user._id === user._id) && (
                <Icon disabled={disabled} color="red" name="trash" />
              )}
            </Comment.Action>
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    </Comment.Group>
  );
}

export default PostComments;
