import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/shop/common-layout";
const Return = () => {
  return (
    <CommonLayout title={"Return Policy"} parent="home">
      <div className="container mt-5" dir="rtl" style={{ textAlign: "right" }}>
        <p
          style={{ fontSize: "22px", fontWeight: "bold" }}
          className="c3"
          dir="rtl"
        >
          <span className="c6">سياسة الاسترجاع</span>
        </p>
        <p
          style={{ fontSize: "18px", fontWeight: "bold" }}
          className="c3"
          dir="rtl"
        >
          <span className="c6">هل يمكنني رفض استلام المنتج؟</span>
        </p>
        <p className="c3" dir="rtl">
          <span className="c1">
            نحن نشجعك دائمًا على فحص المنتج عند التسليم ورفض استلامه في حالة
            وجود أي تلف مرئي أو تباين أو عناصر مفقودة. أسباب الرفض كما يلي:
          </span>
        </p>
        <a id="t.0632906eab182b9c404919f6411ddb7eaea580e5"></a>
        <a id="t.0"></a>
        <table className="c20">
          <tr className="c4">
            <td className="c2" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">استرداد المبلغ كاملا</span>
              </p>
            </td>
            <td className="c7" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">غير صالحة</span>
              </p>
            </td>
            <td className="c11" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">صالحة</span>
              </p>
            </td>
            <td className="c0" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">أسباب لرفض الاستلام</span>
              </p>
            </td>
          </tr>
          <tr className="c8">
            <td className="c2" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c7" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c11" colspan="1" rowspan="1">
              <p className="c10" dir="rtl">
                <span className="c1"></span>
              </p>
            </td>
            <td className="c0" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c1">الوان خاطئة</span>
              </p>
            </td>
          </tr>
          <tr className="c8">
            <td className="c2" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c7" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c11" colspan="1" rowspan="1">
              <p className="c10" dir="rtl">
                <span className="c1"></span>
              </p>
            </td>
            <td className="c0" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c1">أحجام خاطئة</span>
              </p>
            </td>
          </tr>
          <tr className="c8">
            <td className="c2" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c7" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c11" colspan="1" rowspan="1">
              <p className="c10" dir="rtl">
                <span className="c1"></span>
              </p>
            </td>
            <td className="c0" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c1">مواد تصنيع خاطئة</span>
              </p>
            </td>
          </tr>
          <tr className="c8">
            <td className="c2" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c7" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c11" colspan="1" rowspan="1">
              <p className="c10" dir="rtl">
                <span className="c1"></span>
              </p>
            </td>
            <td className="c0" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c1">أبعاد خاطئة</span>
              </p>
            </td>
          </tr>
          <tr className="c8">
            <td className="c2" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c7" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c11" colspan="1" rowspan="1">
              <p className="c10" dir="rtl">
                <span className="c1"></span>
              </p>
            </td>
            <td className="c0" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c1">منتج معيب</span>
              </p>
            </td>
          </tr>
          <tr className="c8">
            <td className="c2" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c7" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c6">✔</span>
              </p>
            </td>
            <td className="c11" colspan="1" rowspan="1">
              <p className="c10" dir="rtl">
                <span className="c1"></span>
              </p>
            </td>
            <td className="c0" colspan="1" rowspan="1">
              <p className="c3" dir="rtl">
                <span className="c1">مشكلة بالتغليف</span>
              </p>
            </td>
          </tr>
        </table>
        <br />
        <br />
        <br />
        <p
          style={{ fontSize: "18px", fontWeight: "bold" }}
          className="c3"
          dir="rtl"
        >
          <span className="c6">كيف يمكنني إرجاع المنتج؟</span>
        </p>
        <ul
          style={{ listStyleType: "circle !important" }}
          className="c3"
          dir="rtl"
        >
          <li style={{ listStyle: "inside" }}>
            في حالة حدوث أي ضرر بسبب الشحن، يرجى الاتصال بنا عبر منصة التواصل
            الاجتماعي الخاصة بنا أو البريد الإلكتروني في غضون 24 ساعة من التسليم
            للإبلاغ عن ذلك باستخدام 3 صور على الأقل أو مقطع فيديو واحد يوضح
            الضرر لإصدار طلب إرجاع للمنتج الخاص بك. (تطبق الشروط والأحكام).
          </li>
          <br />
          <br />
          <li>
            في حالة وجود أي جزء مفقود أو عيب ظاهري؛ يجب الإبلاغ عنه في غضون 48
            ساعة من تاريخ التسليم موضحًا طبيعة الضرر / الخطأ / النقص باستخدام 3
            صور أو مقطع فيديو واحد عبر منصات وسائل التواصل الاجتماعي أو البريد
            الإلكتروني. (تطبق الشروط والاحكام).
          </li>
          <br />
          <br />
          <li>
            جميع المنتجات مؤهلة للإرجاع فقط في حالة تحديد أو ظهور أي عيب في
            التصنيع خلال أول 14 يومًا من تاريخ الاستلام. يرجى الاتصال بنا عبر
            منصات وسائل التواصل الاجتماعي الخاصة بنا أو البريد الإلكتروني
            باستخدام 3 صور على الأقل أو مقطع فيديو واحد يوضح عيب الصناعة لإصدار
            طلب إرجاع المنتج الخاص بك. (تطبق الشروط والأحكام).
          </li>
          <br />
          <br />
          <li>
            <ul>
              <li>
                في حالة تغيير رأي العميل في المنتج&nbsp; يرجى الاتصال بنا عبر
                منصة التواصل الاجتماعي الخاصة بنا أو البريد الإلكتروني ويتم
                إبلاغنا في غضون 24 ساعة من التسليم للإبلاغ عن ذلك باستخدام 3 صور
                على الأقل او مقطع فيديو واحد يوضح حالة المنتج
                <ul>
                  <li>اما المنتجات المصنعة عند الطلب ليست مؤهلة للارجاع.</li>
                  <li>
                    ;أما بخصوص المنتجات الجاهزة فيمكن ارجعاها في غضون 14 يومًا
                    من تاريخ الاستلام فقط في حالة اكتمال ملحقات المنتج ،
                    وتأمينها في العبوة الأصلية وأن يكون المنتج في حالته الأصلية
                    وبيتم خصم رسوم الشحن ذهاب وعودة.
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <br />
          <br />
          <li>
            في حالة إلغاء الطلب للمنتجات المصنعة عند الطلب بعد تأكيد الأوردر ب 4
            أيام بيتم خصم 50% من قيمة المنتج.
          </li>
          <br />
          <li>
            في حالة إرجاع الأوردر بعد توصيله للعميل دون سبب واضح يتم خصم 50% من
            قيمة المنتج بالإضافه إلى مصاريف الشحن ذهاب وعودة
          </li>
          <br />
          <br />
        </ul>
        <br />
        <br />
        <p
          style={{ fontSize: "18px", fontWeight: "bold" }}
          className="c3"
          dir="rtl"
        >
          يتم التحقق من صحة جميع طلبات الإرجاع من قبل فريقنا المختص لتأكيد أهلية
          الطلب. فيما يلي بعض الأمثلة على المنتجات غير المؤهلة للإرجاع:
        </p>
        <ul>
          <li>المنتجات المصنعة عند الطلب في حالة تغيير الرأي في المنتج.</li>
          <br />
          <br />
          <li>
            المنتجات الجاهزة بدون التغليف الأصلي أو ليست في حالتها الاصلية.
          </li>
          <br />
          <br />
          <li>المنتجات التي تجاوزت 14 يومًا من تاريخ الاستلام.</li>
          <br />
          <br />
          <li>
            المنتجات التي تعتبر للاستخدام الشخصي مثل الفراش والوسادة ... إلخ.
          </li>
          <br />
          <br />
          <li>المنتجات التي تم تحديد العيب بها على أنها سوء استخدام.</li>
          <br />
          <br />
          <li>المنتجات التي لم يتم تجميعها بواسطة فريق لا كاسا.</li>
        </ul>
        <br />
        <br />

        <p
          style={{ fontSize: "18px", fontWeight: "bold" }}
          className="c3"
          dir="rtl"
        >
          توفر شركة لا كاسا خدمة التجميع والتركيب لجميع المنتجات باستثناء منتجات
          التثبيت الذاتي التالية:
        </p>

        <ul>
          <li>رفوف لوحدات التلفزيون</li>
          <br />
          <br />
          <li>تخزين الحمام</li>
          <br />
          <br />
          <li>التابلوه</li>
          <br />
          <br />
          <li>ساعات الحائط</li>
          <br />
          <br />
          <li>الرفوف</li>
          <br />
          <br />
        </ul>
        <br />
        <br />

        <p
          style={{ fontSize: "18px", fontWeight: "bold" }}
          className="c3"
          dir="rtl"
        >
          متي يتم استرداد المبلغ المدفوع؟
        </p>

        <p>
          تبدأ عملية استرداد المبلغ المدفوع بمجرد التأكد من استرجاع المنتج الى
          لا كاسا. وتستغرق عملية استرداد المبلغ من 5 إلى 14 يوم عمل (يخضع
          للتغيير بناءً على سياسة جهة إصدار البطاقة البنكية).
        </p>
        <br />
        <br />
        <p
          style={{ fontSize: "18px", fontWeight: "bold" }}
          className="c3"
          dir="rtl"
        >
          كيف يتم عملية استرداد المبلغ المدفوع؟
        </p>
        <p>شركة لا كاسا لا توفرعملية الاسترداد نقدا للعميل.</p>

        <br />
        <br />
        <p
          style={{ fontSize: "18px", fontWeight: "bold" }}
          className="c3"
          dir="rtl"
        >
          وتعتمد طريقة استرداد المبلغ بناءا على طريقة الدفع على النحو التالي:
        </p>
        <table cellspacing="0">
          <tbody>
            <tr>
              <td>
                <p>
                  <strong>طريقة استرداد المبلغ</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>طريقة الدفع</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>تحويل بنكي</p>
              </td>
              <td>
                <p>نقدا</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>تحويل بنكي</p>
              </td>
              <td>
                <p>تحويل بنكي</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>تحويل بنكي</p>
              </td>
              <td>
                <p>فوري</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>بطاقة ائتمانية</p>
              </td>
              <td>
                <p>بطاقة ائتمانية</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>حساب فاليو</p>
              </td>
              <td>
                <p>فاليو</p>
              </td>
            </tr>
          </tbody>
        </table>

        <br />
        <br />
        <p>البريد الالكتروني: cs@lacasa-egy.com</p>
        <br />
        <br />
      </div>
    </CommonLayout>
  );
};
export default Return;
