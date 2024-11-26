import React from "react";
import { Row, Col, Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

function Policies() {
  return (
    <div  >
      <Row gutter={[16, 16]}>
        <Col x>
          <Card
            bordered={false}
            style={{
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Title
              level={3}
              style={{
                textAlign: "center",
                color: "green",
                marginBottom: "24px",
              }}
            >
              FRANKO TRADING LIMITED
            </Title>

            <Title
              level={4}
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#595959",
              }}
            >
              RETURN POLICY
            </Title>

            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8em" }}>
              Subject to Terms and Conditions, Franko Trading Enterprise offers
              returns and/or exchange or refund for items purchased within{" "}
              <strong>7 DAYS OF PURCHASE</strong>. We do not accept returns and
              or exchange for any reason whatsoever after the stated period has
              elapsed.
            </Paragraph>

            <Title
              level={5}
              style={{
                marginTop: "20px",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              ELIGIBILITY FOR REFUND, RETURN, AND/OR EXCHANGE
            </Title>

            {/* WRONG ITEM DELIVERED Card */}
            <Card
              bordered
              style={{
                marginBottom: "20px",
                borderRadius: "8px",
                borderColor: "#d9d9d9",
                padding: "16px",
              }}
            >
              <Title level={5} style={{ color: "#ff4d4f" }}>
                WRONG ITEM DELIVERED
              </Title>
              <ul style={{ paddingLeft: "20px", lineHeight: "1.8em" }}>
                <li>The seals on the box must not be broken/opened.</li>
                <li>There should be no dents and liquid intrusion on the item.</li>
                <li>Proof of Purchase/Receipt must be provided.</li>
              </ul>
            </Card>

            {/* MANUFACTURING DEFECTS Card */}
            <Card
              bordered
              style={{
                marginBottom: "20px",
                borderRadius: "8px",
                borderColor: "#d9d9d9",
                padding: "16px",
              }}
            >
              <Title level={5} style={{ color: "#52c41a" }}>
                MANUFACTURING DEFECTS
              </Title>
              <ul style={{ paddingLeft: "20px", lineHeight: "1.8em" }}>
                <li>
                  Within the 7 days, defective items would be replaced with the
                  same piece/unit (depending on stock availability).
                </li>
                <li>
                  All items shall go through inspection and diagnosis on return
                  to verify the reason provided.
                </li>
                <li>
                  Returns (defective items) after 7 days would be sent to the
                  Brand’s Service Centre for repairs under the Manufacturer
                  Warranty.
                </li>
              </ul>
            </Card>

            {/* INCOMPLETE PACKAGE Card */}
            <Card
              bordered
              style={{
                marginBottom: "20px",
                borderRadius: "8px",
                borderColor: "#d9d9d9",
                padding: "16px",
              }}
            >
              <Title level={5} style={{ color: "#faad14" }}>
                INCOMPLETE PACKAGE
              </Title>
              <ul style={{ paddingLeft: "20px", lineHeight: "1.8em" }}>
                <li>
                  Incomplete package or missing complementary items must be
                  reported within 7 days for immediate redress.
                </li>
              </ul>
            </Card>

            <Title
              level={4}
              style={{
                marginTop: "20px",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              REFUND/CHARGE BACK POLICY
            </Title>

            {/* UNDELIVERED ORDER/PACKAGE Card */}
            <Card
              bordered
              style={{
                marginBottom: "20px",
                borderRadius: "8px",
                borderColor: "#d9d9d9",
                padding: "16px",
              }}
            >
              <Title level={5} style={{ color: "#2f54eb" }}>
                UNDELIVERED ORDER/PACKAGE
              </Title>
              <ul style={{ paddingLeft: "20px", lineHeight: "1.8em" }}>
                <li>
                  Refund/charge back request for undelivered orders will go
                  through vetting and approval, with refunds made within 30
                  days.
                </li>
                <li>
                  Charge back requests must be initiated through customer’s bank
                  for payments made via credit card or other banking platforms.
                </li>
                <li>
                  Refunds will be made by cheque for accounting purposes.
                </li>
              </ul>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Policies;
