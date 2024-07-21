import {
  Button,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  code: string;
}

export default function VerifyCodeEmail({ code }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Your Verification Code</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
            body {
              font-family: 'Inter', Verdana, sans-serif;
              background-color: #f5f5f5;
              color: #333;
              margin: 0;
              padding: 0;
            }
          `}
        </style>
      </Head>
      <Preview>Your Verification Code</Preview>
      <Section
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "8px",
          margin: "20px auto",
          maxWidth: "600px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Row>
          <Heading
            as="h2"
            style={{ color: "#333", fontSize: "24px", marginBottom: "20px" }}
          >
            Your Verification Code
          </Heading>
        </Row>
        <Row>
          <Text
            style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}
          >
            Hi there,
          </Text>
          <Text
            style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}
          >
            Please enter the following code:
          </Text>
          <Text
            style={{
              color: "#007BFF",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {code}
          </Text>
        </Row>
        <Row>
          <Text
            style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}
          >
            If you have any issues, please contact our support team at
            support@ascendifyr.in
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
