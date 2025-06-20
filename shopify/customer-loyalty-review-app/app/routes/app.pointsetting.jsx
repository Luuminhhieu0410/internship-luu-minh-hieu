import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useNavigation, useActionData } from "@remix-run/react";
import prisma from "../db.server";
import { useState } from "react";
import {
  Page,
  FormLayout,
  TextField,
  Button,
  Card,
  Layout,
  Text,
} from "@shopify/polaris";

export const loader = async () => {
  const setting = await prisma.pointSetting.findFirst({
    orderBy: { id: "desc" },
  });
  return json({ setting });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const earnRate = parseFloat(formData.get('earnRate'));
  const spendRate = parseFloat(formData.get('spendRate'));
  const reviewReward = formData.get('reviewReward');

  const reviewPoint = reviewReward ? parseInt(reviewReward.toString()) : null;
  
  const existing = await prisma.pointSetting.findFirst({
    orderBy: { id: 'desc' }
  });

  if (existing) {
    await prisma.pointSetting.update({
      where: { id: existing.id },
      data: {
        earnRate,
        spendRate,
        reviewReward: reviewPoint,
      },
    });
  } else {
    await prisma.pointSetting.create({
      data: {
        earnRate,
        spendRate,
        reviewReward: reviewPoint,
      },
    });
  }

  return json({success : true , message : "Cập nhật thành công"}); 
};


export default function PointSettingPage() {
  const { setting } = useLoaderData();
  const {message} = useActionData();

  console.log("data setting point + " + JSON.stringify(setting));
  const [earnRate, setEarnRate] = useState(setting?.earnRate?.toString());
  const [spendRate, setSpendRate] = useState(setting?.spendRate?.toString());
  const [reviewReward, setReviewReward] = useState(
    setting?.reviewReward?.toString(),
  );
    const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <Page title="Cấu hình tích điểm">
      <Layout>
        <Layout.Section>
          <Form method="post">
            <Card sectioned>
                <Text variant="headingMd" as="h6">
                Last Update : {new Date(setting.updatedAt).toLocaleString()}
            </Text>
            <br />
              <FormLayout>
                <TextField
                  label="Tỷ lệ tích điểm (earnRate)"
                  type="number"
                  step="0.0001"
                  value={earnRate}
                  onChange={(v) => setEarnRate(v)}
                  helpText="VD: Mua 1.000₫ = 1 điểm"
                  name="earnRate"
                  required
                />
                <TextField
                  label="Tỷ lệ quy đổi điểm (spendRate)"
                  type="number"
                  value={spendRate}
                  onChange={(v) => setSpendRate(v)}
                  helpText="VD: 100 điểm = Mã giảm 10.000₫"
                  name="spendRate"
                  required
                />
                <TextField
                  label="Điểm thưởng khi review được duyệt (tùy chọn)"
                  type="number"
                  value={reviewReward}
                  onChange={(v) => setReviewReward(v)}
                  name="reviewReward"
                />
                <Button submit primary>
                 {isSubmitting ? "Đang cập nhật ... " : "Lưu cấu hình mới"}
                </Button>
              </FormLayout>
            </Card>
          </Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
