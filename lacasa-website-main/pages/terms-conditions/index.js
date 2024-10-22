import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/shop/common-layout";
const Terms = () => {
  const lang = localStorage.getItem("lang");
  return (
    <CommonLayout title={"Terms & Conditions"} parent="home">
      {lang == "en" ? (
        <div className="container entry-content mt-5">
          <p>
            <strong>Welcome to La Casa!</strong>
          </p>
          <p>
            These terms and conditions outline the rules and regulations for the
            use of La Casa’s Website, located at lacasa-egy.com.
          </p>
          <p>
            By accessing this website we assume you accept these terms and
            conditions. Do not continue to use La Casa if you do not agree to
            take all of the terms and conditions stated on this page.
          </p>
          <p>
            The following terminology applies to these Terms and Conditions,
            Privacy Statement and Disclaimer Notice and all Agreements:
            “Client”, “You” and “Your” refers to you, the person log on this
            website and compliant to the Company’s terms and conditions. “The
            Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company.
            “Party”, “Parties”, or “Us”, refers to both the Client and
            ourselves.
          </p>
          <p>
            All terms refer to the offer, acceptance, and consideration of the
            payments necessary to undertake the process of our assistance to the
            Client in the most appropriate manner for the express purpose of
            meeting the Client’s needs in respect of provisioning the Company’s
            stated services, in accordance with and subject to, prevailing law
            of Netherlands. Any use of the above terminology or other words in
            the singular, plural, capitalization, and/or he/she or they, are
            taken as interchangeable and therefore as referring to the same.
          </p>
          <p>
            <strong>
              <strong>Registration</strong>
            </strong>
          </p>
          <p>
            Access to certain functionalities of the La Casa platform will
            require you to register with us. If you register with La Casa, you
            agree to provide us with accurate information and update it as
            needed for accuracy. We treat the personally identifiable
            information you provide as part of the registration process in
            accordance with our privacy policy. You may register on La Casa
            using a third-party service (e.g., Facebook); Whereby you give us
            permission to access, store, and use your information from that
            service as permitted by that service and may be described in our
            privacy policy. If you believe your account may have been
            compromised or misused, contact us immediately at La Casa customer
            support.
          </p>
          <p>
            <strong>
              <strong>Termination</strong>
            </strong>
          </p>
          <p>
            Unless La Casa holds the absolute right at i ts own discretion to
            permanently or temporarily suspen d your use of the site or the
            service at any time for any reason, without any notice or liability
            to you. We may terminate your account at any time for any or no
            reason, including if you violate any La Casa policy. Upon
            termination of your use of the service, certain provisions will
            survive termination.
          </p>
          <p>
            <strong>Privacy Policy</strong>
          </p>
          <p>Reservation of Rights</p>
          <p>
            We reserve the right to request that you remove all links or any
            particular link to our Website. You approve to immediately remove
            all links to our Website upon request. We also reserve the right to
            amend these terms and conditions and its linking policy at any time.
            By continuously linking to our Website, you agree to be bound to and
            follow these linking terms and conditions.
          </p>
          <p>Removal of links from our website</p>
          <p>
            If you find any link on our Website that is offensive for any
            reason, you are free to contact and inform us at any moment. We will
            consider requests to remove links but we are not obligated to or so
            or to respond to you directly.
          </p>
          <p>
            We do not ensure that the information on this website is correct, we
            do not warrant its completeness or accuracy; nor do we promise to
            ensure that the website remains available or that the material on
            the website is kept up to date.
          </p>
          <p>Disclaimer</p>
          <p>
            To the maximum extent permitted by applicable law, we exclude all
            representations, warranties, and conditions relating to our website
            and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul>
            <li>
              limit or exclude our or your liability for death or personal
              injury;
            </li>
            <li>
              limit or exclude our or your liability for fraud or fraudulent
              misrepresentation;
            </li>
            <li>
              limit any of our or your liabilities in any way that is not
              permitted under applicable law; or
            </li>
            <li>
              exclude any of our or your liabilities that may not be excluded
              under applicable law.
            </li>
          </ul>
          <p>
            The limitations and prohibitions of liability set in this Section
            and elsewhere in this disclaimer: (a) are subject to the preceding
            paragraph; and (b) govern all liabilities arising under the
            disclaimer, including liabilities arising in contract, in tort, and
            for breach of statutory duty.
          </p>
          <p>
            As long as the website and the information and services on the
            website are provided free of charge, we will not be liable for any
            loss or damage of any nature.
          </p>
          <p>Cookies</p>
          <p>
            We employ the use of cookies. By accessing La Casa, you agreed to
            use cookies in agreement with La Casa’s Privacy Policy.
          </p>
          <p>
            Most interactive websites use cookies to let us retrieve the user’s
            details for each visit. Cookies are used by our website to enable
            the functionality of certain areas to make it easier for people
            visiting our website. Some of our affiliate/advertising partners may
            also use cookies.
          </p>
          <p>License</p>
          <p>
            Unless otherwise stated, La Casa and/or its licensors own the
            intellectual property rights for all material on La Casa. All
            intellectual property rights are reserved. You may access this from
            La Casa for your own personal use subjected to restrictions set in
            these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from La Casa</li>
            <li>Sell, rent or sub-license material from La Casa</li>
            <li>Reproduce, duplicate or copy material from La Casa</li>
            <li>Redistribute content from La Casa</li>
          </ul>
          <p>This Agreement shall begin on the date hereof (1/8/2020)</p>
          <p>
            Parts of this website offer an opportunity for users to post and
            exchange opinions and information in certain areas of the website.
            La Casa does not filter, edit, publish or review Comments prior to
            their presence on the website. Comments do not reflect the views and
            opinions of La Casa, its agents, and/or affiliates.
          </p>
          <p>
            Comments reflect the views and opinions of the person who posts
            their views and opinions. To the extent permitted by applicable
            laws, La Casa shall not be liable for the Comments or for any
            liability, damages, or expenses caused and/or suffered as a result
            of any use of and/or posting of and/or appearance of the Comments on
            this website.
          </p>
          <p>
            La Casa reserves the right to monitor all Comments and to remove any
            Comments which can be considered inappropriate, offensive, or cause
            a breach of these Terms and Conditions.
          </p>
          <p>You warrant and represent that:</p>
          <ul>
            <li>
              You are entitled to post the Comments on our website and have all
              necessary licenses and consents to do so;
            </li>
            <li>
              The Comments do not invade any intellectual property right,
              including without limitation copyright, patent or trademark of any
              third party;
            </li>
            <li>
              The Comments do not contain any defamatory, libelous, offensive,
              indecent or otherwise unlawful material which is an invasion of
              privacy
            </li>
            <li>
              The Comments will not be used to solicit or promote business or
              custom or present commercial activities or unlawful activity.
            </li>
            <li>
              You hereby grant La Casa a non-exclusive license to use,
              reproduce, edit and authorize others to use, reproduce and edit
              any of your Comments in any and all forms, formats or media.
            </li>
          </ul>
          <p>Hyperlinking to our Content</p>
          <p>
            The following organizations may link to our Website without prior
            written approval:
          </p>
          <ul>
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>
              Online directory distributors may link to our Website in the same
              manner as they hyperlink to the Websites of other listed
              businesses; and
            </li>
            <li>
              System wide Accredited Businesses except soliciting non-profit
              organizations, charity shopping malls, and charity fundraising
              groups which may not hyperlink to our Website.
            </li>
          </ul>
          <p>
            These organizations may link to our home page, to publications, or
            to other Website information so long as the link: (a) is not in any
            way deceptive; (b) does not falsely imply sponsorship, endorsement,
            or approval of the linking party and its products and/or services;
            and (c) fits within the context of the linking party’s site.
          </p>
          <p>
            We may consider and approve other link requests from the following
            types of organizations:
          </p>
          <ul>
            <li>
              Commonly-known consumer and/or business information sources;
            </li>
            <li>Dot.com community sites;</li>
            <li>Associations or other groups representing charities;</li>
            <li>Online directory distributors;</li>
            <li>Internet portals;</li>
            <li>Accounting, law and consulting firms; and</li>
            <li>Educational institutions and trade associations.</li>
          </ul>
          <p>
            We will approve link requests from these organizations if we decide
            that: (a) the link would not make us look unfavorably to ourselves
            or to our accredited businesses; (b) the organization does not have
            any negative records with us; (c) the benefit to us from the
            visibility of the hyperlink compensates the absence of La Casa, and
            (d) the link is in the context of general resource information.
          </p>
          <p>
            These organizations may link to our home page so long as the link:
            (a) is not in any way deceptive; (b) does not falsely imply
            sponsorship, endorsement or approval of the linking party and its
            products or services; and (c) fits within the context of the linking
            party’s site.
          </p>
          <p>
            If you are one of the organizations listed in paragraph 2 above and
            are interested in linking to our website, you must inform us by
            sending an email to La Casa. Please include your name, your
            organization name, contact information as well as the URL of your
            site, a list of any URLs from which you intend to link to our
            Website, and a list of the URLs on our site to which you would like
            to link. Wait 2-3 weeks for a response.
          </p>
          <p>Approved organizations may hyperlink to our Website as follows:</p>
          <ul>
            <li>By use of our corporate name; or</li>
            <li>By use of the uniform resource locator being linked to; or</li>
            <li>
              By use of any other description of our Website being linked to
              that makes sense within the context and format of content on the
              linking party’s site.
            </li>
          </ul>
          <p>
            No use of La Casa’s logo or other artwork will be allowed for
            linking absent a trademark license agreement.
          </p>
          <p>iFrames</p>
          <p>
            Without prior approval and written permission, you may not create
            frames around our Web Pages that alter in any way the visual
            presentation or appearance of our Website.
          </p>
          <p>Content Liability</p>
          <p>
            We shall not be held responsible for any content that appears on
            your Website. You agree to protect and defend us against all claims
            that are rising on our Website. No link(s) should appear on any
            Website that may be interpreted as libelous, obscene, or criminal,
            or which infringes, otherwise violates, or advocates the
            infringement or other violation of, any third party rights.
          </p>
          <p>General</p>
          <p>
            We reserve the right at any time to: (i) change the terms and
            conditions of this agreement, consistent with applicable law; (ii)
            change the La Casa platform, including eliminating or discontinuing
            any information or services or other features in whole or in part;
            and (iii) deny or terminate your La Casa account, or use of and
            access to the La Casa platform. Any changes we make to the terms and
            conditions will be effective immediately upon our making such
            changes available on the La Casa platform. You agree that your
            continued use of the La Casa platform after such changes c
            onstitutes your acceptance of such changes. If you do not agree with
            any of the updates to this agreement, you should not use the La Casa
            platform. Be sure to return to this page periodically to ensure your
            familiarity with the most current version of the terms of use.
          </p>
          <p>
            <strong>QUESTIONS</strong>
          </p>
          <p>
            If you have any questions concerning our return policy, please
            contact us at:&nbsp;
          </p>
          <p>info@lacasa-egy.com&nbsp;</p>
        </div>
      ) : (
        <div className="container entry-content mt-5 end-ar">
          <p>
            <strong>مرحبًا بكم في لا كاسا!</strong>
          </p>
          <p>
            lacasa-egy.com تحدد هذه البنود والشروط قواعد ولوائح استخدام موقع ويب
            لا كاسا الموجود على ،
          </p>
          <p>
            من خلال الوصول إلى هذا الموقع، نفترض أنك تقبل هذه البنود والشروط. لا
            تستمر في استخدام لا كاسا إذا لم توافق على اتخاذ كل البنود والشروط
            المذكورة في هذه الصفحة.
          </p>
          <p>
            ينطبق المصطلحات التالية على هذه البنود والشروط وبيان الخصوصية وإشعار
            الإخلاء وجميع الاتفاقيات: "العميل"، "أنت" و "أنتم" يشير إليك، الشخص
            الذي يسجل في هذا الموقع ويلتزم بشروط وأحكام الشركة. "الشركة"، "نحن"،
            "أنفسنا"، "نحن"، "شركتنا" تشير إلى شركتنا. "حفلة"، "الأطراف"، أو
            "نحن" تشير إلى العميل وأنفسنا.
          </p>
          <p>
            جميع المصطلحات تشير إلى عرض القبول والتقدير والمدفوعات اللازمة
            للقيام بعملية المساعدة للعميل بأكثر الطرق المناسبة لغرض تلبية
            احتياجات العميل فيما يتعلق بتوفير خدمات الشركة المذكورة، وفقًا
            للقوانين السارية وفقًا لقانون هولندا. أي استخدام للمصطلحات المذكورة
            أعلاه أو كلمات أخرى في الواحدة، الجمع، الحروف الكبيرة، و/أو هو/هي أو
            هم، تعتبر متبادلة وبالتالي تشير إلى الشيء نفسه.
          </p>
          <p>
            <strong>
              <strong>التسجيل</strong>
            </strong>
          </p>
          <p>
            الوصول إلى بعض وظائف منصة لا كاسا سيتطلب منك التسجيل معنا. إذا قمت
            بالتسجيل في لا كاسا، فإنك توافق على تقديم معلومات دقيقة لنا وتحديثها
            عند الضرورة لضمان الدقة. نعامل بيانات الهوية الشخصية التي تقدمها
            كجزء من عملية التسجيل وفقًا لسياسة الخصوصية لدينا. يمكنك التسجيل في
            لا كاسا باستخدام خدمة طرف ثالث (مثل Facebook)؛ حيث تمنحنا إذنًا
            للوصول إلى معلوماتك وتخزينها واستخدامها من تلك الخدمة بما يسمح به
            تلك الخدمة وكما قد يتم وصفه في سياسة الخصوصية لدينا. إذا كنت تعتقد
            أن حسابك قد تعرض للاختراق أو تم استخدامه بشكل غير سليم، يُرجى
            الاتصال بنا على الفور عبر دعم عملاء لا كاسا.
          </p>
          <p>
            <strong>
              <strong>الإنهاء</strong>
            </strong>
          </p>
          <p>
            ما لم تمتلك لا كاسا الحق الكامل بموجب تقديرها الخاص في إيقاف
            استخدامك للموقع أو الخدمة دائمًا أو مؤقتًا في أي وقت ولأي سبب، دون
            أي إشعار أو مسؤولية تجاهك. قد نقوم بإنهاء حسابك في أي وقت ولأي سبب،
            بما في ذلك إذا انتهكت أي سياسة لا كاسا. عند انتهاء استخدامك للخدمة،
            ستستمر بعض الأحكام بعد الإنهاء.
          </p>
          <p>
            <strong>سياسة الخصوصية</strong>
          </p>
          <p>احتفاظ بالحقوق</p>
          <p>
            نحتفظ بالحق في طلب إزالة جميع الروابط أو أي رابط معين إلى موقعنا على
            الويب. توافق على إزالة جميع الروابط إلى موقعنا على الفور بناءً على
            الطلب. نحتفظ أيضًا بالحق في تعديل هذه البنود والشروط وسياسة الربط في
            أي وقت. من خلال الربط باستمرار إلى موقعنا على الويب، فإنك توافق على
            الالتزام ببنود وشروط الربط هذه والشروط.
          </p>
          <p>إزالة الروابط من موقعنا على الويب</p>
          <p>
            إذا وجدت أي رابط على موقعنا على الويب يعتبر مسيئًا لأي سبب، فلديك
            الحرية في الاتصال بنا وإعلامنا في أي لحظة. سننظر في طلبات إزالة
            الروابط، ولكن ليس لدينا واجب إلزامي للقيام بذلك أو الرد عليك
            مباشرةً.
          </p>
          <p>
            نحن لا نضمن صحة المعلومات على هذا الموقع، ولا نضمن اكتمالها أو
            دقتها؛ ولا نعد بضمان بقاء الموقع متاحًا أو بقاء المواد على الموقع
            محدثة.
          </p>
          <p>إخلاء المسؤولية</p>
          <p>
            إلى أقصى حد يسمح به القانون المعمول به، نستبعد جميع العروض والضمانات
            والشروط المتعلقة بموقعنا على الويب واستخدام هذا الموقع. لن يتم في
            هذا إخلاء المسؤولية:
          </p>
          <ul>
            <li>
              قيد أو استبعاد مسؤوليتنا أو مسؤوليتكم عن الوفاة أو الإصابة
              الشخصية؛
            </li>
            <li>
              قيد أو استبعاد مسؤوليتنا أو مسؤوليتكم عن الاحتيال أو التمثيل
              الاحتيالي؛
            </li>
            <li>
              قيد أي من مسؤوليتنا أو مسؤوليتكم بأي طريقة غير مسموح بها بموجب
              القانون المعمول به؛ أو
            </li>
            <li>
              استبعاد أي من مسؤوليتنا أو مسؤوليتكم التي قد لا يجوز استبعادها
              بموجب القانون المعمول به.
            </li>
          </ul>
          <p>
            القيود وحظر المسؤولية المنصوص عليها في هذا القسم وفي أماكن أخرى في
            هذا إخلاء المسؤولية: (أ) تخضع للفقرة السابقة؛ و (ب) تنظم جميع
            المسؤوليات الناتجة بموجب إخلاء المسؤولية، بما في ذلك المسؤوليات
            الناشئة عن العقد والتقصير وانتهاك الواجب القانوني.
          </p>
          <p>
            طالما تم توفير الموقع والمعلومات والخدمات على الموقع مجانًا، فإننا
            لن نكون مسؤولين عن أي خسائر أو أضرار من أي نوع.
          </p>
          <p>ملفات تعريف الارتباط (Cookies)</p>
          <p>
            نستخدم ملفات تعريف الارتباط. من خلال الوصول إلى لا كاسا، فإنك توافق
            على استخدام ملفات تعريف الارتباط وفقًا لسياسة الخصوصية لـ لا كاسا.
          </p>
          <p>
            معظم المواقع التفاعلية تستخدم ملفات تعريف الارتباط لاستعادة تفاصيل
            المستخدم لكل زيارة. تُستخدم ملفات تعريف الارتباط من قبل موقعنا
            لتمكين وظائف مناطق معينة لتسهيل زيارة الأشخاص لموقعنا. قد تستخدم بعض
            شركاؤنا التابعين/الإعلانات أيضًا ملفات تعريف الارتباط.
          </p>
          <p>رخصة</p>
          <p>
            ما لم يذكر خلاف ذلك، فإن لا كاسا و/أو ممن لهم حقوق الملكية الفكرية
            يمتلكون حقوق الملكية الفكرية لجميع المواد على لا كاسا. جميع حقوق
            الملكية الفكرية محفوظة. يمكنك الوصول إلى هذا من لا كاسا لاستخدامه
            لاستخدامك الشخصي بشرط القيود المنصوص عليها في هذه البنود والشروط.
          </p>
          <p>يجب أن لا تقوم بما يلي:</p>
          <ul>
            <li>إعادة نشر المواد من لا كاسا</li>
            <li>بيع، تأجير أو ترخيص المواد من لا كاسا</li>
            <li>استنساخ أو تكرار أو نسخ المواد من لا كاسا</li>
            <li>إعادة توزيع المحتوى من لا كاسا</li>
          </ul>
          <p>هذا الاتفاق سيبدأ في تاريخه (1/8/2020)</p>
          <p>
            أجزاء من هذا الموقع تقدم فرصة للمستخدمين لنشر وتبادل الآراء
            والمعلومات في مناطق معينة من الموقع. لا كاسا لا تقوم بفرز أو تحرير
            أو نشر أو مراجعة التعليقات قبل وجودها على الموقع. التعليقات لا تعكس
            آراء وآراء لا كاسا، أعوانها و/أو تابعيها.
          </p>
          <p>
            التعليقات تعكس آراء وآراء الشخص الذي ينشر آرائه وآرائه. إلى الحد
            الذي يسمح به القوانين المعمول بها، لا كاسا لن تكون مسؤولة عن
            التعليقات أو عن أي مسؤولية أو أضرار أو نفقات ناجمة عن أي استخدام أو
            نشر أو ظهور للتعليقات على هذا الموقع.
          </p>
          <p>
            لا كاسا تحتفظ بالحق في مراقبة جميع التعليقات وإزالة أي تعليقات يمكن
            اعتبارها غير مناسبة، مسيئة، أو تسبب في انتهاك هذه البنود والشروط.
          </p>
          <p>أنت تضمن وتمثل أن:</p>
          <ul>
            <li>
              لديك الحق في نشر التعليقات على موقعنا ولديك جميع التراخيص
              والموافقات اللازمة للقيام بذلك.
            </li>
            <li>
              التعليقات لا تنتهك أي حق ملكية فكرية، بما في ذلك ودون حصر حقوق
              النشر، وبراءات الاختراع، أو العلامة التجارية لأي طرف ثالث.
            </li>
            <li>
              التعليقات لا تحتوي على أي مواد مسيئة، مشهورة بالقذف، مسيئة، فاحشة،
              أو غير قانونية تش constitueي انتهاكًا للخصوصية.
            </li>
            <li>
              لن تتم استخدام التعليقات لاستدراج أو تعزيز الأعمال أو العملاء أو
              تقديم أنشطة تجارية أو نشاطات غير قانونية.
            </li>
            <li>
              تمنح لا كاسا ترخيصًا غير حصري لاستخدام، واستنساخ، وتحرير، وتفويض
              الآخرين لاستخدام، واستنساخ، وتحرير أي من تعليقاتك بجميع الأشكال
              والصيغ ووسائل الإعلام.
            </li>
          </ul>
          <p>الربط بمحتوانا (Hyperlinking to our Content)</p>
          <p>
            يمكن للمنظمات التالية الربط بموقعنا على الويب دون موافقة مكتوبة
            مسبقة:
          </p>
          <ul>
            <li>الجهات الحكومية؛</li>
            <li>محركات البحث؛</li>
            <li>مؤسسات الأخبار؛</li>
            <li>
              يمكن لموزعي الدلائل عبر الإنترنت أن يربطوا بموقعنا على الويب بنفس
              الطريقة التي يربطون بها بمواقع الأعمال الأخرى المدرجة؛ و
            </li>
            <li>
              منظمات الأعمال المعترف بها على نطاق النظام باستثناء المنظمات الغير
              هادفة للربح ومراكز التسوق الخيرية وجماعات جمع التبرعات الخيرية
              التي قد لا تقوم بربط موقعنا على الويب.
            </li>
          </ul>
          <p>
            يمكن لهذه المنظمات الربط بصفحتنا الرئيسية أو بالمنشورات أو بمعلومات
            الموقع الإلكتروني الأخرى طالما أن الرابط: (أ) ليس بأي شكل من الأشكال
            خادعًا؛ (ب) لا يُظهر زورًا رعايةً أو تأييدًا أو موافقة من الجهة
            المرتبطة ومنتجاتها و/أو خدماتها؛ و (ج) يتناسب مع سياق موقع الجهة
            المرتبطة.
          </p>
          <p>
            قد ننظر ونوافق على طلبات الربط الأخرى من أنواع منظمات الجهات
            التالية:
          </p>
          <ul>
            <li>
              مصادر المعلومات الاستهلاكية و/أو المعلومات التجارية المعروفة
              عمومًا؛
            </li>
            <li>مواقع مجتمعية دوت كوم؛</li>
            <li>الجمعيات أو الجماعات الأخرى التي تمثل الجمعيات الخيرية؛</li>
            <li>موزعو الدلائل عبر الإنترنت؛</li>
            <li>البوابات الإلكترونية على الإنترنت؛</li>
            <li>شركات المحاسبة والقانون والاستشارات؛ و</li>
            <li>المؤسسات التعليمية والجمعيات التجارية.</li>
          </ul>
          <p>
            سنوافق على طلبات الربط من هذه المنظمات إذا قررنا: (أ) أن الرابط لن
            يجعلنا نبدو بشكل سلبي بالنسبة لأنفسنا أو لشركاتنا المعتمدة؛ (ب) أن
            المنظمة ليس لديها أي سجلات سلبية لدينا؛ (ج) أن الفائدة لنا من رؤية
            الرابط يعوض غياب لا كاسا، و (د) أن الرابط يكون في سياق معلومات
            المصادر العامة.
          </p>
          <p>
            يمكن لهذه المنظمات الربط بصفحتنا الرئيسية طالما أن الرابط: (أ) ليس
            بأي شكل من الأشكال خادعًا؛ (ب) لا يملي زورًا رعايةً أو تأييدًا أو
            موافقة من الجهة المرتبطة ومنتجاتها أو خدماتها؛ و (ج) يندرج ضمن سياق
            موقع الجهة المرتبطة.
          </p>
          <p>
            إذا كنت واحدًا من المنظمات المدرجة في الفقرة 2 أعلاه وترغب في الربط
            بموقعنا على الويب، يجب عليك إعلامنا من خلال إرسال بريد إلكتروني إلى
            لا كاسا. يرجى تضمين اسمك، واسم منظمتك، ومعلومات الاتصال الخاصة بك،
            بالإضافة إلى عنوان موقع الويب الخاص بك، وقائمة بأي عناوين URL تعتزم
            الربط بها بموقعنا، وقائمة بعناوين URL على موقعنا التي ترغب في الربط
            بها. انتظر 2-3 أسابيع للحصول على رد.
          </p>
          <p>
            يمكن للمنظمات المعتمدة الربط بموقعنا على الويب على النحو التالي:
          </p>

          <ul>
            <li>باستخدام اسم شركتنا؛ أو</li>
            <li>باستخدام عنوان الموارد المتجانس الذي يتم الربط به؛ أو</li>
            <li>
              باستخدام أي وصف آخر لموقع الويب الخاص بنا يتناسب مع السياق وتنسيق
              المحتوى على موقع الجهة المرتبطة.
            </li>
          </ul>
          <p>
            لن يُسمح بأي استخدام لشعار لا كاسا أو أي أعمال فنية أخرى للربط بدون
            اتفاق ترخيص العلامة التجارية.
          </p>
          <p>iFrames</p>
          <p>
            بدون موافقة مسبقة وإذن كتابي، قد لا يتم إنشاء إطارات حول صفحات الويب
            لدينا تغير بأي شكل من الأشكال التقديم المرئي أو مظهر موقعنا على
            الويب.
          </p>
          <p>المسؤولية عن المحتوى</p>
          <p>
            لن نكون مسؤولين عن أي محتوى يظهر على موقع الويب الخاص بك. توافق على
            حمايتنا والدفاع عنا ضد جميع الادعاءات التي تظهر على موقع الويب الخاص
            بنا. لا يجب أن تظهر أي روابط على أي موقع ويب قد يتم تفسيرها على أنها
            تشهيرية أو مبتذلة أو إجرامية، أو تنتهك بأي شكل آخر، أو تدعو إلى
            انتهاك أو انتهاك حقوق أي طرف ثالث بأي شكل آخر.
          </p>
          <p>عام</p>
          <p>
            نحتفظ بالحق في أي وقت بالقيام بالتالي: (i) تغيير شروط وأحكام هذا
            الاتفاق، وفقًا للقانون المعمول به؛ (ii) تغيير منصة لا كاسا، بما في
            ذلك القضاء على أو إيقاف أي معلومات أو خدمات أو ميزات أخرى كليًا أو
            جزئيًا؛ و (iii) رفض أو إنهاء حسابك على منصة لا كاسا، أو استخدامك
            لمنصة لا كاسا والوصول إليها. ستكون أي تغييرات نقوم بها في شروط
            وأحكام هذا الاتفاق سارية المفعول فور توفر تلك التغييرات على منصة لا
            كاسا. توافق على أن استخدامك المستمر لمنصة لا كاسا بعد تلك التغييرات
            يشكل موافقتك على تلك التغييرات. إذا لم توافق على أي من التحديثات في
            هذا الاتفاق، يجب عليك عدم استخدام منصة لا كاسا. تأكد من العودة إلى
            هذه الصفحة بشكل دوري لضمان تفاهمك لأحدث إصدار من شروط الاستخدام.
          </p>
          <p>
            <strong>الأسئلة</strong>
          </p>
          <p>
            إذا كانت لديك أي أسئلة بخصوص سياسة الإرجاع لدينا، يرجى الاتصال بنا
            على:
          </p>
          <p>info@lacasa-egy.com</p>
        </div>
      )}
    </CommonLayout>
  );
};
export default Terms;
