import React from "react";
import { Form, TextArea } from "semantic-ui-react";

function CommonInputs({ user: { bio }, handleChange }) {
  return (
    <>
      <Form.Field
        required
        control={TextArea}
        name="bio"
        value={bio}
        onChange={handleChange}
        placeholder="bio"
      />
    </>
  );
}

export default CommonInputs;
