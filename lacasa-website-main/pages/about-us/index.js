import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const CommonLayout = dynamic(() =>
  import("../../components/shop/common-layout")
);
const Terms = () => {
  const lang = localStorage.getItem("lang");
  return (
    <CommonLayout title={"About Us"} parent="home">
      {lang == "en" ? (
        <div className="container entry-content mt-5">
          <h1 style={{ fontSize: "22px" }}>WHO WE ARE? </h1>
          <p>
            La Casa is an e-commerce platform that helps furnish houses for
            customers by choosing the right tools, colors, and furniture to
            decorate and complete their dream homes.
            <br />
          </p>
          <p>
            {" "}
            Established in 2020 and based in Cairo, Egypt. We are specialized in
            the curation and selling of everything home-related from the best in
            the industry
          </p>
          <p></p>
          <p></p>
          <h1 style={{ fontSize: "22px" }}>MISSION</h1>
          <p>
            Our mission is to contribute to building better homes by providing
            high-quality products and services, and by becoming the region’s
            most efficient online furnishing store. We will bring you all your
            favorite brands by saving time, effort, and ease of payment from the
            comfort of wherever you are.
          </p>
          <p>
            We will insure the above by launching our application soon and
            becoming the first in the region to offer 2D and 3D features to help
            easing the consumers sales experience.
          </p>
          <p></p>
          <p></p>
          <h1 style={{ fontSize: "22px" }}>VISION</h1>
          <p>
            Our investments in house and interiors directly addresses the strong
            demand in the MENA region such as large growing populations, a vast
            variety of options and an array of competitive prices. We help
            support our vendors growth and the modernization of their sales that
            will always be in demand.
          </p>
          <p></p>
          <p></p>
        </div>
      ) : (
        <div className="container entry-content mt-5 end-ar">
          <h1 style={{ fontSize: "22px" }}>من نحن؟</h1>
          <p>
            لا كاسا هي منصة تجارة إلكترونية تساعد في تأثيث المنازل للعملاء من
            خلال اختيار الأدوات والألوان والأثاث المناسب لتزيين واستكمال منازل
            أحلامهم.
            <br />
          </p>
          <p>
            تأسست في عام 2020 ومقرها القاهرة، مصر. نحن متخصصون في تجميع وبيع كل
            ما يتعلق بالمنزل من أفضل المنتجات في الصناعة.
          </p>
          <p></p>
          <p></p>
          <h1 style={{ fontSize: "22px" }}>المهمة</h1>
          <p>
            مهمتنا هي المساهمة في بناء منازل أفضل من خلال توفير منتجات وخدمات
            عالية الجودة، وأن نصبح أكثر متجر عبر الإنترنت للأثاث كفاءة في
            المنطقة. سنقدم لكم جميع العلامات التجارية المفضلة لديكم من خلال
            توفير الوقت والجهد وسهولة الدفع من راحة أينما كنتم.
          </p>
          <p>
            سنضمن ذلك عن طريق إطلاق تطبيقنا قريبًا وأن نصبح الأوائل في المنطقة
            الذين يقدمون ميزات 2D و 3D لمساعدة تسوق المستهلكين.
          </p>
          <p></p>
          <p></p>
          <h1 style={{ fontSize: "22px" }}>رؤيتنا</h1>
          <p>
            استثماراتنا في المنزل والديكور تعالج مباشرة الطلب القوي في منطقة
            الشرق الأوسط وشمال إفريقيا مثل الزيادة الكبيرة في السكان والتنوع
            الواسع في الخيارات ومجموعة من الأسعار التنافسية. نساعد في دعم نمو
            موردينا وتحديث نمط مبيعاتهم التي ستظل دائمًا مطلوبة.
          </p>
          <p></p>
          <p></p>
        </div>
      )}
    </CommonLayout>
  );
};
export default Terms;
