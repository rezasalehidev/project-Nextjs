import React, { useState } from "react";
import { List, Search as SearchComponent, Image } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import Router from "next/router";
import cookie from "js-cookie";
let cancel;

function SearchBar() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const { value } = e.target;
    setText(value);
    setLoading(true);

    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const token = cookie.get("token");

      const res = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: { Authorization: token },
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      if (res.data.length === 0) {
        setLoading(false);
      }

      setResults(res.data);
    } catch (error) {}
    setLoading(false);
  };

  return (
    <SearchComponent
      onBlur={() => {
        results.length > 0 && setResults([]);
        loading && setLoading(false);
        setText("");
      }}
      loading={loading}
      value={text}
      onSearchChange={handleChange}
      results={results}
      resultRenderer={resultRenderer}
      minCharacters={1}
      onResultSelect={(e, data) => Router.push(`/${data.result.username}`)}
      placeholder="جستجو"
    />
  );
}

const resultRenderer = ({ _id, profilePicUrl, name }) => {
  return (
    <List key={_id}>
      <List.Item>
        <Image src={profilePicUrl} alt="profileUser" avatar />
        @<List.Content header={name} as="a" />
      </List.Item>
    </List>
  );
};

export default SearchBar;
