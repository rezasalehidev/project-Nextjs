import React, { useState } from "react";
import { Form } from "semantic-ui-react";

function CommentInput() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Form reply>
        <Form.Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add Comment"
          action={{
            color: "blue",
            icon: "edit",
            loading: loading,
            disabled: text === "" || loading,
          }}
        />
      </Form>
    </>
  );
}
export default CommentInput;
