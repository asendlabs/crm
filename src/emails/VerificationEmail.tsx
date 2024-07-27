import {
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
export function VerificationEmail({
  verifyCode,
  type,
}: {
  verifyCode: string;
  type: "signup" | "login";
}) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>
          {type === "signup"
            ? "Your Ascend Sign Up Code"
            : "Your Ascend Temporary Login Code"}
        </title>
      </Head>
      <Section>
        <Row>
          <Heading
            as="h2"
            style={{ color: "#333", fontSize: "24px", marginBottom: "20px" }}
          >
            {type === "signup"
              ? "Welcome to Ascend CRM!"
              : "Welcome back to Ascend CRM!"}
          </Heading>
        </Row>
        <Row>here is your code</Row>
        <Row>
          {" "}
          <Heading
            as="h3"
            style={{
              color: "blue",
              fontSize: "12px",
              marginBottom: "20px",
              marginTop: "10px",
            }}
          >
            {verifyCode}
          </Heading>
        </Row>{" "}
      </Section>
    </Html>
  );
}
