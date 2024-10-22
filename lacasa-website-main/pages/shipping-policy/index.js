import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/shop/common-layout";
const shipping = () => {
  const lang = localStorage.getItem("lang");
  return (
    <CommonLayout title={"Shipping policy"} parent="home">
      {lang == "en" ? (
        <div className="container entry-content mt-5">
          SHIPPING & DELIVERY POLICY
          <br />
          <p>
            <strong>Last updated January 01, 2023</strong>
          </p>
          <p>
            In the event that you choose to pay upon delivery for an order
            valued at more than 10,000 pounds, 25% of the total order will be
            paid in advance When you order products in areas outside Cairo and
            Giza, 25% of the total order is paid in advance For products with
            customized specifications, 50% is paid in advance of the total order
            In the case of receiving an order without an elevator, 50 pounds
            will be added for each floor after the fourth floor
          </p>
          <p>
            This Shipping & Delivery Policy is part of our
            https://lacasa-egy.com/terms-conditions ("Terms") and should be
            therefore read alongside our main Terms:
            https://lacasa-egy.com/terms-conditions.
          </p>
          <p>
            Please carefully review our Shipping & Delivery Policy when
            purchasing our products. This policy will apply to any order you
            place with us.
          </p>
          <h5>WHAT ARE MY SHIPPING & DELIVERY OPTIONS?</h5>
          <p>
            We offer various shipping options. In some cases a third-party
            supplier may be managing our inventory and will be responsible for
            shipping your products. Shipping Fees
          </p>
          <h4>We offer shipping at the following rates:</h4>
          <p>
            Standard 14 All times and dates given for delivery of the products
            are given in good faith but are estimates only.
          </p>
          <h5>DO YOU DELIVER INTERNATIONALLY?</h5>
          <p>We do not offer international shipping.</p>
          <h5>QUESTIONS ABOUT RETURNS?</h5>
          <p>
            If you have questions about returns, please review our Return
            Policy: https://lacasa-egy.com/refund-policy.
          </p>
          <h5>HOW CAN YOU CONTACT US ABOUT THIS POLICY?</h5>
          <p>
            If you have any further questions or comments, you may contact us
            by:
          </p>
          Email: Support@lacasa-egy.com
        </div>
      ) : (
        <div className="container entry-content mt-5 end-ar">
          سياسة الشحن والتوصيل
          <br />
          <p>
            <strong>آخر تحديث في 1 يناير 2023</strong>
          </p>
          <p>
            في حال اختيارك الدفع عند التسليم لطلب يزيد قيمته عن 10,000 جنيه
            مصري، سيتم دفع 25٪ من إجمالي الطلب مقدمًا. عند طلب منتجات في مناطق
            خارج القاهرة والجيزة، سيتم دفع 25٪ من إجمالي الطلب مقدمًا. بالنسبة
            للمنتجات ذات المواصفات المخصصة، سيتم دفع 50٪ مقدمًا من إجمالي الطلب.
            في حالة استلام طلب بدون مصعد، سيتم إضافة 50 جنيهًا مصريًا لكل طابق
            بعد الطابق الرابع.
          </p>
          <p>
            {`https://lacasa-egy.com/terms-conditions : هذه سياسة الشحن والتوصيل
            جزء من شروطنا ("الشروط") وبالتالي يجب قراءتها جنبًا إلى جنب مع
            شروطنا الرئيسية: https://lacasa-egy.com/terms-conditions.`}
          </p>
          <p>
            يرجى مراجعة سياسة الشحن والتوصيل لدينا بعناية عند شراء منتجاتنا.
            ستنطبق هذه السياسة على أي طلب تقوم بإجرائه معنا.
          </p>
          <h5>ما هي خيارات الشحن والتوصيل المتاحة لي؟</h5>
          <p>
            نقدم مجموعة متنوعة من خيارات الشحن. في بعض الحالات، قد يكون مورد طرف
            ثالث هو من يدير مخزوننا وسيكون مسؤولاً عن شحن منتجاتك. رسوم الشحن
          </p>
          <h4>نحن نقدم خيارات الشحن بالأسعار التالية:</h4>
          <p>
            14 قياسيًا. جميع الأوقات والتواريخ المذكورة لتسليم المنتجات تُذكر
            بصدق ولكنها تعتمد على التقديرات فقط.
          </p>
          <h5>هل تقومون بالتوصيل دوليًا؟</h5>
          <p>نحن لا نقدم خدمة الشحن الدولي.</p>
          <h5>أسئلة حول الإرجاع؟</h5>
          <p>
            {` https://lacasa-egy.com/refund-policy إذا كان لديك أسئلة حول الإرجاع، يُرجى مراجعة سياسة الإرجاع لدينا:
           `}
          </p>
          <h5>كيف يمكنكم الاتصال بنا بشأن هذه السياسة؟</h5>
          <p>
            إذا كانت لديك أي أسئلة أو تعليقات إضافية، يمكنك الاتصال بنا عبر:
          </p>
          Support@lacasa-egy.com:البريد الإلكتروني
        </div>
      )}
    </CommonLayout>
  );
};
export default shipping;
