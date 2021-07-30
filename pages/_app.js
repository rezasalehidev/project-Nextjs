import App from "next/app";
import Layout from "../components/Layout/Layout";
import "semantic-ui-css/semantic.min.css";
import { parseCookies, destroyCookie } from "nookies";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import axios from "axios";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);
    let pageProps = {};

    const protectedRoutes = ctx.pathname === "/";

    if (!token) {
      protectedRoutes && redirectUser(ctx, "/login");
    } else {
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      try {
        const res = await axios.get(`${baseUrl}/api/auth`, {
          headers: { Authorization: token },
        });

        const { user, followeruser } = res.data;

        // if(!user) !protectedRoutes && redirectUser(ctx,"/login");

        pageProps.user = user;
        pageProps.followeruser = followeruser;
      } catch (error) {
        destroyCookie(ctx, "token");
        redirectUser(ctx, "/login");
      }
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
