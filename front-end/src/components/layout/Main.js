import React from "react";
import { Layout } from "antd";
import Sidenav from "./Sidenav";
import Header from "./Header";
import Footer from "./Footer";
import "../../assets/styles/main.css";
const { Content } = Layout;

function Main({ children }) {
  return (
    <Layout>
      {/* <Sidenav /> */}
      <Layout>
        <Header />
        <Content>{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default Main;
