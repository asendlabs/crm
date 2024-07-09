import {
  Button,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  code: string;
}

export default function VerificationEmail({
    code
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Verify</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello</Heading>
        </Row>
        <Row>
          <a href={`http://localhost:3000/verify/${code}`}>CLick here to verify</a>
        </Row>
      </Section>
    </Html>
  );
}
