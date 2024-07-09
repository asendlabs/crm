import {
  Button,
  Font,
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

export default function VerificationEmail({ code }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify your email for Ascend CRM</title>
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
      <Preview>Verify your email for Ascend CRM</Preview>
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
            Welcome to Ascend CRM!
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
            Thank you for joining Ascend CRM! We're excited to have you on
            board. To get started, please verify your email address by clicking
            the button below.
          </Text>
        </Row>
        <Row style={{ marginBottom: "20px", textAlign: "center" }}>
          <Button
            href={`${process.env.VERIFICATION_URL}/${code}`}
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "25px",
              fontSize: "16px",
            }}
          >
            Verify Email
          </Button>
        </Row>
        <Row>
          <Text
            style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}
          >
            If the button doesn't work, copy and paste the link below into your
            browser:
          </Text>
          <Link
            href={`${process.env.VERIFICATION_URL}/${code}`}
            style={{
              color: "#007BFF",
              fontSize: "16px",
              wordBreak: "break-all",
            }}
          >
            {`${process.env.VERIFICATION_URL}/${code}`}
          </Link>
        </Row>
        <Row>
          <Text
            style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}
          >
            Ascend CRM is designed to help you manage your customer
            relationships more effectively, with tools for tracking
            interactions, managing sales, and much more.
          </Text>
          <Text
            style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}
          >
            If you have any questions or need assistance, feel free to reply to
            this email or contact our support team at support@ascendifyr.in
          </Text>
        </Row>
        <Row
          style={{
            borderTop: "1px solid #eaeaea",
            marginTop: "20px",
            paddingTop: "20px",
            textAlign: "center",
          }}
        >
          <Text style={{ color: "#999", fontSize: "14px" }}>
            &copy; {new Date().getFullYear()} Ascend CRM. All rights reserved.
          </Text>
          <Text style={{ color: "#999", fontSize: "14px" }}>
            Ascend CRM, Lawaypora, Srinagar, 190017, India.
          </Text>
          <Text style={{ color: "#999", fontSize: "14px" }}>
            You received this email because you signed up for Ascend CRM. If you
            didn't, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
