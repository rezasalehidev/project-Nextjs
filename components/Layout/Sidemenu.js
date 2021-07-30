import React from "react";
import { useRouter } from "next/router";
import { Icon, List } from "semantic-ui-react";
import Link from "next/link";
import { logOutUser } from "../../utils/authUser";

function Sidemenu({
  user: { unreadMessage, unreadNotification, username, email },
}) {
  const router = useRouter();

  const isActive = (route) => router.pathname === route;

  return (
    <>
      <List
        style={{ paddingTop: "1rem" }}
        size="big"
        verticalAlign="middle"
        selection
      >
        {/* home */}
        <Link href="/">
          <List.Item active={isActive("/")}>
            <Icon name="home" size="large" color={isActive("/") && "teal"} />
            <List.Content>
              <List.Header content="Home" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        {/* messages */}
        <Link href="/messages">
          <List.Item active={isActive("/messages")}>
            <Icon
              name={unreadMessage ? "hand point right" : "mail outline"}
              size="large"
              color={
                (isActive("/messages") && "teal") || (unreadMessage && "red")
              }
            />
            <List.Content>
              <List.Header content="messages" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        {/* Notifications */}
        <Link href="/notifications">
          <List.Item active={isActive("/notifications")}>
            <Icon
              name={unreadNotification ? "hand point right" : "bell outline"}
              size="large"
              color={
                (isActive("/notifications") && "teal") ||
                (unreadNotification && "red")
              }
            />
            <List.Content>
              <List.Header content="notifications" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        {/* profileUser */}
        <Link href={`/${username}`}>
          <List.Item active={router.query.username === username}>
            <Icon
              name="user"
              size="large"
              color={router.query.username === username && "teal"}
            />
            <List.Content>
              <List.Header content="Profile" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        {/* Logout */}
        <List.Item onClick={() => logOutUser(email)}>
          <Icon name="log out" size="large" />
          <List.Content>
            <List.Header content="Logout" />
          </List.Content>
        </List.Item>
      </List>
    </>
  );
}

export default Sidemenu;
