import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailBodyProps {
  email: string;
  token: string;
  baseurl: string;
}

export const VerificationEmailBody = ({
  email,
  token,
  baseurl,
}: VerificationEmailBodyProps) => (
  <Html>
    <Head />
    <Preview>Your Asend Verification Code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify Your Email</Heading>
        <Text style={{ ...text, marginBottom: "16px" }}>
          Click the button below to verify your email address and complete your
          registration:
        </Text>
        <Button
          style={button}
          href={`${baseurl}/api/auth/verify-email?token=${token}&email=${email}`}
          target="_blank"
        >
          Verify Email
        </Button>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "24px",
            marginBottom: "16px",
          }}
        >
          If you didn&apos;t request this email, please ignore it.
        </Text>
        <Text style={footer}>
          <Link href="" target="_blank" style={{ ...link, color: "#898989" }}>
            Asend
          </Link>
          , the revolutionary CRM.
        </Text>
      </Container>
    </Body>
  </Html>
);

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

const button = {
  padding: "18px",
  backgroundColor: "#2754C5",
  color: "#ffffff",
  borderRadius: "5px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "bold",
};
