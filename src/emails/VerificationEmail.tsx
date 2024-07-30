import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  verifyCode: string;
  type: "signup" | "login";
}

export const VerificationEmail = ({
  verifyCode,
  type,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {type === "signup"
        ? "Your Ascend sign up code"
        : "Your temporary Ascend login code"}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {type === "signup"
            ? "Your Ascend sign up code"
            : "Your temporary Ascend login code"}
        </Heading>
        <Text style={{ ...text, marginBottom: "8px" }}>
          copy and paste this code into the{" "}
          {type === "signup" ? "Sign Up" : "Login"} screen
        </Text>
        <code style={code}>{verifyCode}</code>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          If you didn&apos;t try to {type === "signup" ? "Sign Up" : "Login"},
          just ignore this email and chill.
        </Text>
        {/* <Img
          src={`${baseUrl}/static/notion-logo.png`}
          width="32"
          height="32"
          alt="Notion's Logo"
        /> */}
        <Text style={footer}>
          <Link href="" target="_blank" style={{ ...link, color: "#898989" }}>
            Ascend
          </Link>
          , the revolutionary crm
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail; 

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
