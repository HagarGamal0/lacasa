<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('areas')->truncate();
        $data = [

            /* Start Cairo ID:1 */
            ['city_id' => '1', 'ar_name' => '15 مايو', 'name' => '15 May'],
            ['city_id' => '1', 'ar_name' => 'الازبكية', 'name' => 'Al Azbakeyah'],
            ['city_id' => '1', 'ar_name' => 'البساتين', 'name' => 'Al Basatin'],
            ['city_id' => '1', 'ar_name' => 'التبين', 'name' => 'Tebin'],
            ['city_id' => '1', 'ar_name' => 'الخليفة', 'name' => 'El-Khalifa'],
            ['city_id' => '1', 'ar_name' => 'الدراسة', 'name' => 'El darrasa'],
            ['city_id' => '1', 'ar_name' => 'الدرب الاحمر', 'name' => 'Aldarb Alahmar'],
            ['city_id' => '1', 'ar_name' => 'الزاوية الحمراء', 'name' => 'Zawya al-Hamra'],
            ['city_id' => '1', 'ar_name' => 'الزيتون', 'name' => 'El-Zaytoun'],
            ['city_id' => '1', 'ar_name' => 'الساحل', 'name' => 'Sahel'],
            ['city_id' => '1', 'ar_name' => 'السلام', 'name' => 'El Salam'],
            ['city_id' => '1', 'ar_name' => 'السيدة زينب', 'name' => 'Sayeda Zeinab'],
            ['city_id' => '1', 'ar_name' => 'الشرابية', 'name' => 'El Sharabeya'],
            ['city_id' => '1', 'ar_name' => 'مدينة الشروق', 'name' => 'Shorouk'],
            ['city_id' => '1', 'ar_name' => 'الظاهر', 'name' => 'El Daher'],
            ['city_id' => '1', 'ar_name' => 'العتبة', 'name' => 'Ataba'],
            ['city_id' => '1', 'ar_name' => 'القاهرة الجديدة', 'name' => 'New Cairo'],
            ['city_id' => '1', 'ar_name' => 'المرج', 'name' => 'El Marg'],
            ['city_id' => '1', 'ar_name' => 'عزبة النخل', 'name' => 'Ezbet el Nakhl'],
            ['city_id' => '1', 'ar_name' => 'المطرية', 'name' => 'Matareya'],
            ['city_id' => '1', 'ar_name' => 'المعادى', 'name' => 'Maadi'],
            ['city_id' => '1', 'ar_name' => 'المعصرة', 'name' => 'Maasara'],
            ['city_id' => '1', 'ar_name' => 'المقطم', 'name' => 'Mokattam'],
            ['city_id' => '1', 'ar_name' => 'المنيل', 'name' => 'Manyal'],
            ['city_id' => '1', 'ar_name' => 'الموسكى', 'name' => 'Mosky'],
            ['city_id' => '1', 'ar_name' => 'النزهة', 'name' => 'Nozha'],
            ['city_id' => '1', 'ar_name' => 'الوايلى', 'name' => 'Waily'],
            ['city_id' => '1', 'ar_name' => 'باب الشعرية', 'name' => 'Bab al-Shereia'],
            ['city_id' => '1', 'ar_name' => 'بولاق', 'name' => 'Bolaq'],
            ['city_id' => '1', 'ar_name' => 'جاردن سيتى', 'name' => 'Garden City'],
            ['city_id' => '1', 'ar_name' => 'حدائق القبة', 'name' => 'Hadayek El-Kobba'],
            ['city_id' => '1', 'ar_name' => 'حلوان', 'name' => 'Helwan'],
            ['city_id' => '1', 'ar_name' => 'دار السلام', 'name' => 'Dar Al Salam'],
            ['city_id' => '1', 'ar_name' => 'شبرا', 'name' => 'Shubra'],
            ['city_id' => '1', 'ar_name' => 'طره', 'name' => 'Tura'],
            ['city_id' => '1', 'ar_name' => 'عابدين', 'name' => 'Abdeen'],
            ['city_id' => '1', 'ar_name' => 'عباسية', 'name' => 'Abaseya'],
            ['city_id' => '1', 'ar_name' => 'عين شمس', 'name' => 'Ain Shams'],
            ['city_id' => '1', 'ar_name' => 'مدينة نصر', 'name' => 'Nasr City'],
            ['city_id' => '1', 'ar_name' => 'مصر الجديدة', 'name' => 'New Heliopolis'],
            ['city_id' => '1', 'ar_name' => 'مصر القديمة', 'name' => 'Masr Al Qadima'],
            ['city_id' => '1', 'ar_name' => 'منشية ناصر', 'name' => 'Mansheya Nasir'],
            ['city_id' => '1', 'ar_name' => 'مدينة بدر', 'name' => 'Badr City'],
            ['city_id' => '1', 'ar_name' => 'مدينة العبور', 'name' => 'Obour City'],
            ['city_id' => '1', 'ar_name' => 'وسط البلد', 'name' => 'Cairo Downtown'],
            ['city_id' => '1', 'ar_name' => 'الزمالك', 'name' => 'Zamalek'],
            ['city_id' => '1', 'ar_name' => 'قصر النيل', 'name' => 'Kasr El Nile'],
            ['city_id' => '1', 'ar_name' => 'الرحاب', 'name' => 'Rehab'],
            ['city_id' => '1', 'ar_name' => 'القطامية', 'name' => 'Katameya'],
            ['city_id' => '1', 'ar_name' => 'مدينتي', 'name' => 'Madinty'],
            ['city_id' => '1', 'ar_name' => 'روض الفرج', 'name' => 'Rod Alfarag'],
            ['city_id' => '1', 'ar_name' => 'شيراتون', 'name' => 'Sheraton'],
            ['city_id' => '1', 'ar_name' => 'الجمالية', 'name' => 'El-Gamaleya'],
            ['city_id' => '1', 'ar_name' => 'العاشر من رمضان', 'name' => '10th of Ramadan City'],
            ['city_id' => '1', 'ar_name' => 'الحلمية', 'name' => 'Helmeyat Alzaytoun'],
            ['city_id' => '1', 'ar_name' => 'النزهة الجديدة', 'name' => 'New Nozha'],
            ['city_id' => '1', 'ar_name' => 'العاصمة الإدارية', 'name' => 'Capital New'],
            /* End Cairo ID:1 */

            /* Start Giza ID:2 */
            ['city_id' => '2', 'ar_name' => 'الجيزة', 'name' => 'Giza'],
            ['city_id' => '2', 'ar_name' => 'السادس من أكتوبر', 'name' => 'Sixth of October'],
            ['city_id' => '2', 'ar_name' => 'الشيخ زايد', 'name' => 'Cheikh Zayed'],
            ['city_id' => '2', 'ar_name' => 'الحوامدية', 'name' => 'Hawamdiyah'],
            ['city_id' => '2', 'ar_name' => 'البدرشين', 'name' => 'Al Badrasheen'],
            ['city_id' => '2', 'ar_name' => 'الصف', 'name' => 'Saf'],
            ['city_id' => '2', 'ar_name' => 'أطفيح', 'name' => 'Atfih'],
            ['city_id' => '2', 'ar_name' => 'العياط', 'name' => 'Al Ayat'],
            ['city_id' => '2', 'ar_name' => 'الباويطي', 'name' => 'Al-Bawaiti'],
            ['city_id' => '2', 'ar_name' => 'منشأة القناطر', 'name' => 'ManshiyetAl Qanater'],
            ['city_id' => '2', 'ar_name' => 'أوسيم', 'name' => 'Oaseem'],
            ['city_id' => '2', 'ar_name' => 'كرداسة', 'name' => 'Kerdasa'],
            ['city_id' => '2', 'ar_name' => 'أبو النمرس', 'name' => 'Abu Nomros'],
            ['city_id' => '2', 'ar_name' => 'كفر غطاطي', 'name' => 'Kafr Ghati'],
            ['city_id' => '2', 'ar_name' => 'منشأة البكاري', 'name' => 'Manshiyet Al Bakari'],
            ['city_id' => '2', 'ar_name' => 'الدقى', 'name' => 'Dokki'],
            ['city_id' => '2', 'ar_name' => 'العجوزة', 'name' => 'Agouza'],
            ['city_id' => '2', 'ar_name' => 'الهرم', 'name' => 'Haram'],
            ['city_id' => '2', 'ar_name' => 'الوراق', 'name' => 'Warraq'],
            ['city_id' => '2', 'ar_name' => 'امبابة', 'name' => 'Imbaba'],
            ['city_id' => '2', 'ar_name' => 'بولاق الدكرور', 'name' => 'Boulaq Dakrour'],
            ['city_id' => '2', 'ar_name' => 'الواحات البحرية', 'name' => 'Al Wahat Al Baharia'],
            ['city_id' => '2', 'ar_name' => 'العمرانية', 'name' => 'Omraneya'],
            ['city_id' => '2', 'ar_name' => 'المنيب', 'name' => 'Moneeb'],
            ['city_id' => '2', 'ar_name' => 'بين السرايات', 'name' => 'Bin Alsarayat'],
            ['city_id' => '2', 'ar_name' => 'الكيت كات', 'name' => 'Kit Kat'],
            ['city_id' => '2', 'ar_name' => 'المهندسين', 'name' => 'Mohandessin'],
            ['city_id' => '2', 'ar_name' => 'فيصل', 'name' => 'Faisal'],
            ['city_id' => '2', 'ar_name' => 'أبو رواش', 'name' => 'Abu Rawash'],
            ['city_id' => '2', 'ar_name' => 'حدائق الأهرام', 'name' => 'Hadayek Alahram'],
            ['city_id' => '2', 'ar_name' => 'الحرانية', 'name' => 'Haraneya'],
            ['city_id' => '2', 'ar_name' => 'حدائق اكتوبر', 'name' => 'Hadayek October'],
            ['city_id' => '2', 'ar_name' => 'صفط اللبن', 'name' => 'Saft Allaban'],
            ['city_id' => '2', 'ar_name' => 'القرية الذكية', 'name' => 'Smart Village'],
            ['city_id' => '2', 'ar_name' => 'ارض اللواء', 'name' => 'Ard Ellwaa'],
            /* End Giza ID:2 */

            /* Start Alexandria ID:3 */
            ['city_id' => '3', 'ar_name' => 'ابو قير', 'name' => 'Abu Qir'],
            ['city_id' => '3', 'ar_name' => 'الابراهيمية', 'name' => 'Al Ibrahimeyah'],
            ['city_id' => '3', 'ar_name' => 'الأزاريطة', 'name' => 'Azarita'],
            ['city_id' => '3', 'ar_name' => 'الانفوشى', 'name' => 'Anfoushi'],
            ['city_id' => '3', 'ar_name' => 'الدخيلة', 'name' => 'Dekheila'],
            ['city_id' => '3', 'ar_name' => 'السيوف', 'name' => 'El Soyof'],
            ['city_id' => '3', 'ar_name' => 'العامرية', 'name' => 'Ameria'],
            ['city_id' => '3', 'ar_name' => 'اللبان', 'name' => 'El Labban'],
            ['city_id' => '3', 'ar_name' => 'المفروزة', 'name' => 'Al Mafrouza'],
            ['city_id' => '3', 'ar_name' => 'المنتزه', 'name' => 'El Montaza'],
            ['city_id' => '3', 'ar_name' => 'المنشية', 'name' => 'Mansheya'],
            ['city_id' => '3', 'ar_name' => 'الناصرية', 'name' => 'Naseria'],
            ['city_id' => '3', 'ar_name' => 'امبروزو', 'name' => 'Ambrozo'],
            ['city_id' => '3', 'ar_name' => 'باب شرق', 'name' => 'Bab Sharq'],
            ['city_id' => '3', 'ar_name' => 'برج العرب', 'name' => 'Bourj Alarab'],
            ['city_id' => '3', 'ar_name' => 'ستانلى', 'name' => 'Stanley'],
            ['city_id' => '3', 'ar_name' => 'سموحة', 'name' => 'Smouha'],
            ['city_id' => '3', 'ar_name' => 'سيدى بشر', 'name' => 'Sidi Bishr'],
            ['city_id' => '3', 'ar_name' => 'شدس', 'name' => 'Shads'],
            ['city_id' => '3', 'ar_name' => 'غيط العنب', 'name' => 'Gheet Alenab'],
            ['city_id' => '3', 'ar_name' => 'فلمينج', 'name' => 'Fleming'],
            ['city_id' => '3', 'ar_name' => 'فيكتوريا', 'name' => 'Victoria'],
            ['city_id' => '3', 'ar_name' => 'كامب شيزار', 'name' => 'Camp Shizar'],
            ['city_id' => '3', 'ar_name' => 'كرموز', 'name' => 'Karmooz'],
            ['city_id' => '3', 'ar_name' => 'محطة الرمل', 'name' => 'Mahta Alraml'],
            ['city_id' => '3', 'ar_name' => 'مينا البصل', 'name' => 'Mina El-Basal'],
            ['city_id' => '3', 'ar_name' => 'العصافرة', 'name' => 'Asafra'],
            ['city_id' => '3', 'ar_name' => 'العجمي', 'name' => 'Agamy'],
            ['city_id' => '3', 'ar_name' => 'بكوس', 'name' => 'Bakos'],
            ['city_id' => '3', 'ar_name' => 'بولكلي', 'name' => 'Boulkly'],
            ['city_id' => '3', 'ar_name' => 'كليوباترا', 'name' => 'Cleopatra'],
            ['city_id' => '3', 'ar_name' => 'جليم', 'name' => 'Glim'],
            ['city_id' => '3', 'ar_name' => 'المعمورة', 'name' => 'Al Mamurah'],
            ['city_id' => '3', 'ar_name' => 'المندرة', 'name' => 'Al Mandara'],
            ['city_id' => '3', 'ar_name' => 'محرم بك', 'name' => 'Moharam Bek'],
            ['city_id' => '3', 'ar_name' => 'الشاطبي', 'name' => 'Elshatby'],
            ['city_id' => '3', 'ar_name' => 'سيدي جابر', 'name' => 'Sidi Gaber'],
            ['city_id' => '3', 'ar_name' => 'الساحل الشمالي', 'name' => 'North Coast/sahel'],
            ['city_id' => '3', 'ar_name' => 'الحضرة', 'name' => 'Alhadra'],
            ['city_id' => '3', 'ar_name' => 'العطارين', 'name' => 'Alattarin'],
            ['city_id' => '3', 'ar_name' => 'سيدي كرير', 'name' => 'Sidi Kerir'],
            ['city_id' => '3', 'ar_name' => 'الجمرك', 'name' => 'Elgomrok'],
            ['city_id' => '3', 'ar_name' => 'المكس', 'name' => 'Al Max'],
            ['city_id' => '3', 'ar_name' => 'مارينا', 'name' => 'Marina'],
            /* End Alexandria ID:3 */

            /* Start Dakahlia ID:4 */
            ['city_id' => '4', 'ar_name' => 'المنصورة', 'name' => 'Mansoura'],
            ['city_id' => '4', 'ar_name' => 'طلخا', 'name' => 'Talkha'],
            ['city_id' => '4', 'ar_name' => 'ميت غمر', 'name' => 'Mitt Ghamr'],
            ['city_id' => '4', 'ar_name' => 'دكرنس', 'name' => 'Dekernes'],
            ['city_id' => '4', 'ar_name' => 'أجا', 'name' => 'Aga'],
            ['city_id' => '4', 'ar_name' => 'منية النصر', 'name' => 'Menia El Nasr'],
            ['city_id' => '4', 'ar_name' => 'السنبلاوين', 'name' => 'Sinbillawin'],
            ['city_id' => '4', 'ar_name' => 'الكردي', 'name' => 'El Kurdi'],
            ['city_id' => '4', 'ar_name' => 'بني عبيد', 'name' => 'Bani Ubaid'],
            ['city_id' => '4', 'ar_name' => 'المنزلة', 'name' => 'Al Manzala'],
            ['city_id' => '4', 'ar_name' => 'تمي الأمديد', 'name' => 'tami al\'amdid'],
            ['city_id' => '4', 'ar_name' => 'الجمالية', 'name' => 'aljamalia'],
            ['city_id' => '4', 'ar_name' => 'شربين', 'name' => 'Sherbin'],
            ['city_id' => '4', 'ar_name' => 'المطرية', 'name' => 'Mataria'],
            ['city_id' => '4', 'ar_name' => 'بلقاس', 'name' => 'Belqas'],
            ['city_id' => '4', 'ar_name' => 'ميت سلسيل', 'name' => 'Meet Salsil'],
            ['city_id' => '4', 'ar_name' => 'جمصة', 'name' => 'Gamasa'],
            ['city_id' => '4', 'ar_name' => 'محلة دمنة', 'name' => 'Mahalat Damana'],
            ['city_id' => '4', 'ar_name' => 'نبروه', 'name' => 'Nabroh'],
            /* End Dakahlia ID:4 */

            /* Start Red Sea ID:5 */
            ['city_id' => '5', 'ar_name' => 'الغردقة', 'name' => 'Hurghada'],
            ['city_id' => '5', 'ar_name' => 'رأس غارب', 'name' => 'Ras Ghareb'],
            ['city_id' => '5', 'ar_name' => 'سفاجا', 'name' => 'Safaga'],
            ['city_id' => '5', 'ar_name' => 'القصير', 'name' => 'El Qusiar'],
            ['city_id' => '5', 'ar_name' => 'مرسى علم', 'name' => 'Marsa Alam'],
            ['city_id' => '5', 'ar_name' => 'الشلاتين', 'name' => 'Shalatin'],
            ['city_id' => '5', 'ar_name' => 'حلايب', 'name' => 'Halaib'],
            ['city_id' => '5', 'ar_name' => 'الدهار', 'name' => 'Aldahar'],
            /* End Red Sea ID:5 */

            /* Start Beheira ID:6 */
            ['city_id' => '6', 'ar_name' => 'دمنهور', 'name' => 'Damanhour'],
            ['city_id' => '6', 'ar_name' => 'كفر الدوار', 'name' => 'Kafr El Dawar'],
            ['city_id' => '6', 'ar_name' => 'رشيد', 'name' => 'Rashid'],
            ['city_id' => '6', 'ar_name' => 'إدكو', 'name' => 'Edco'],
            ['city_id' => '6', 'ar_name' => 'أبو المطامير', 'name' => 'Abu al-Matamir'],
            ['city_id' => '6', 'ar_name' => 'أبو حمص', 'name' => 'Abu Homs'],
            ['city_id' => '6', 'ar_name' => 'الدلنجات', 'name' => 'Delengat'],
            ['city_id' => '6', 'ar_name' => 'المحمودية', 'name' => 'Mahmoudiyah'],
            ['city_id' => '6', 'ar_name' => 'الرحمانية', 'name' => 'Rahmaniyah'],
            ['city_id' => '6', 'ar_name' => 'إيتاي البارود', 'name' => 'Itai Baroud'],
            ['city_id' => '6', 'ar_name' => 'حوش عيسى', 'name' => 'Housh Eissa'],
            ['city_id' => '6', 'ar_name' => 'شبراخيت', 'name' => 'Shubrakhit'],
            ['city_id' => '6', 'ar_name' => 'كوم حمادة', 'name' => 'Kom Hamada'],
            ['city_id' => '6', 'ar_name' => 'بدر', 'name' => 'Badr'],
            ['city_id' => '6', 'ar_name' => 'وادي النطرون', 'name' => 'Wadi Natrun'],
            ['city_id' => '6', 'ar_name' => 'النوبارية الجديدة', 'name' => 'New Nubaria'],
            ['city_id' => '6', 'ar_name' => 'النوبارية', 'name' => 'Alnoubareya'],
            /* End Beheira ID:6 */

            /* Start Fayoum ID:7 */
            ['city_id' => '7', 'ar_name' => 'الفيوم', 'name' => 'Fayoum'],
            ['city_id' => '7', 'ar_name' => 'الفيوم الجديدة', 'name' => 'Fayoum El Gedida'],
            ['city_id' => '7', 'ar_name' => 'طامية', 'name' => 'Tamiya'],
            ['city_id' => '7', 'ar_name' => 'سنورس', 'name' => 'Snores'],
            ['city_id' => '7', 'ar_name' => 'إطسا', 'name' => 'Etsa'],
            ['city_id' => '7', 'ar_name' => 'إبشواي', 'name' => 'Epschway'],
            ['city_id' => '7', 'ar_name' => 'يوسف الصديق', 'name' => 'Yusuf El Sediaq'],
            ['city_id' => '7', 'ar_name' => 'الحادقة', 'name' => 'Hadqa'],
            ['city_id' => '7', 'ar_name' => 'اطسا', 'name' => 'Atsa'],
            ['city_id' => '7', 'ar_name' => 'الجامعة', 'name' => 'Algamaa'],
            ['city_id' => '7', 'ar_name' => 'السيالة', 'name' => 'Sayala'],
            /* End Fayoum ID:7 */

            /* Start Gharbia ID:8 */
            ['city_id' => '8', 'ar_name' => 'طنطا', 'name' => 'Tanta'],
            ['city_id' => '8', 'ar_name' => 'المحلة الكبرى', 'name' => 'Al Mahalla Al Kobra'],
            ['city_id' => '8', 'ar_name' => 'كفر الزيات', 'name' => 'Kafr El Zayat'],
            ['city_id' => '8', 'ar_name' => 'زفتى', 'name' => 'Zefta'],
            ['city_id' => '8', 'ar_name' => 'السنطة', 'name' => 'El Santa'],
            ['city_id' => '8', 'ar_name' => 'قطور', 'name' => 'Qutour'],
            ['city_id' => '8', 'ar_name' => 'بسيون', 'name' => 'Basion'],
            ['city_id' => '8', 'ar_name' => 'سمنود', 'name' => 'Samannoud'],
            /* End Gharbia ID:8 */

            /* Start Ismailia ID:9 */
            ['city_id' => '9', 'ar_name' => 'الإسماعيلية', 'name' => 'Ismailia'],
            ['city_id' => '9', 'ar_name' => 'فايد', 'name' => 'Fayed'],
            ['city_id' => '9', 'ar_name' => 'القنطرة شرق', 'name' => 'Qantara Sharq'],
            ['city_id' => '9', 'ar_name' => 'القنطرة غرب', 'name' => 'Qantara Gharb'],
            ['city_id' => '9', 'ar_name' => 'التل الكبير', 'name' => 'El Tal El Kabier'],
            ['city_id' => '9', 'ar_name' => 'أبو صوير', 'name' => 'Abu Sawir'],
            ['city_id' => '9', 'ar_name' => 'القصاصين الجديدة', 'name' => 'Kasasien El Gedida'],
            ['city_id' => '9', 'ar_name' => 'نفيشة', 'name' => 'Nefesha'],
            ['city_id' => '9', 'ar_name' => 'الشيخ زايد', 'name' => 'Sheikh Zayed'],
            /* End Ismailia ID:9 */

            /* Start Monufya ID:10 */
            ['city_id' => '10', 'ar_name' => 'شبين الكوم', 'name' => 'Shbeen El Koom'],
            ['city_id' => '10', 'ar_name' => 'مدينة السادات', 'name' => 'Sadat City'],
            ['city_id' => '10', 'ar_name' => 'منوف', 'name' => 'Menouf'],
            ['city_id' => '10', 'ar_name' => 'سرس الليان', 'name' => 'Sars El-Layan'],
            ['city_id' => '10', 'ar_name' => 'أشمون', 'name' => 'Ashmon'],
            ['city_id' => '10', 'ar_name' => 'الباجور', 'name' => 'Al Bagor'],
            ['city_id' => '10', 'ar_name' => 'قويسنا', 'name' => 'Quesna'],
            ['city_id' => '10', 'ar_name' => 'بركة السبع', 'name' => 'Berkat El Saba'],
            ['city_id' => '10', 'ar_name' => 'تلا', 'name' => 'Tala'],
            ['city_id' => '10', 'ar_name' => 'الشهداء', 'name' => 'Al Shohada'],
            /* Start Monufya ID:10 */

            /* Start Minya ID:11 */
            ['city_id' => '11', 'ar_name' => 'المنيا', 'name' => 'Minya'],
            ['city_id' => '11', 'ar_name' => 'المنيا الجديدة', 'name' => 'Minya El Gedida'],
            ['city_id' => '11', 'ar_name' => 'العدوة', 'name' => 'El Adwa'],
            ['city_id' => '11', 'ar_name' => 'مغاغة', 'name' => 'Magagha'],
            ['city_id' => '11', 'ar_name' => 'بني مزار', 'name' => 'Bani Mazar'],
            ['city_id' => '11', 'ar_name' => 'مطاي', 'name' => 'Mattay'],
            ['city_id' => '11', 'ar_name' => 'سمالوط', 'name' => 'Samalut'],
            ['city_id' => '11', 'ar_name' => 'المدينة الفكرية', 'name' => 'Madinat El Fekria'],
            ['city_id' => '11', 'ar_name' => 'ملوي', 'name' => 'Meloy'],
            ['city_id' => '11', 'ar_name' => 'دير مواس', 'name' => 'Deir Mawas'],
            ['city_id' => '11', 'ar_name' => 'ابو قرقاص', 'name' => 'Abu Qurqas'],
            ['city_id' => '11', 'ar_name' => 'ارض سلطان', 'name' => 'Ard Sultan'],
            /* End Minya ID:11 */

            /* Start Qalubia ID:12 */
            ['city_id' => '12', 'ar_name' => 'بنها', 'name' => 'Banha'],
            ['city_id' => '12', 'ar_name' => 'قليوب', 'name' => 'Qalyub'],
            ['city_id' => '12', 'ar_name' => 'شبرا الخيمة', 'name' => 'Shubra Al Khaimah'],
            ['city_id' => '12', 'ar_name' => 'القناطر الخيرية', 'name' => 'Al Qanater Charity'],
            ['city_id' => '12', 'ar_name' => 'الخانكة', 'name' => 'Khanka'],
            ['city_id' => '12', 'ar_name' => 'كفر شكر', 'name' => 'Kafr Shukr'],
            ['city_id' => '12', 'ar_name' => 'طوخ', 'name' => 'Tukh'],
            ['city_id' => '12', 'ar_name' => 'قها', 'name' => 'Qaha'],
            ['city_id' => '12', 'ar_name' => 'العبور', 'name' => 'Obour'],
            ['city_id' => '12', 'ar_name' => 'الخصوص', 'name' => 'Khosous'],
            ['city_id' => '12', 'ar_name' => 'شبين القناطر', 'name' => 'Shibin Al Qanater'],
            ['city_id' => '12', 'ar_name' => 'مسطرد', 'name' => 'Mostorod'],
            /* End Qalubia ID:12 */

            /* Start New Valley ID:13 */
            ['city_id' => '13', 'ar_name' => 'الخارجة', 'name' => 'El Kharga'],
            ['city_id' => '13', 'ar_name' => 'باريس', 'name' => 'Paris'],
            ['city_id' => '13', 'ar_name' => 'موط', 'name' => 'Mout'],
            ['city_id' => '13', 'ar_name' => 'الفرافرة', 'name' => 'Farafra'],
            ['city_id' => '13', 'ar_name' => 'بلاط', 'name' => 'Balat'],
            ['city_id' => '13', 'ar_name' => 'الداخلة', 'name' => 'Dakhla'],
            /* End New Valley ID:13 */

            /* Start South Sinai ID:14 */
            ['city_id' => '14', 'ar_name' => 'السويس', 'name' => 'Suez'],
            ['city_id' => '14', 'ar_name' => 'الجناين', 'name' => 'Alganayen'],
            ['city_id' => '14', 'ar_name' => 'عتاقة', 'name' => 'Ataqah'],
            ['city_id' => '14', 'ar_name' => 'العين السخنة', 'name' => 'Ain Sokhna'],
            ['city_id' => '14', 'ar_name' => 'فيصل', 'name' => 'Faysal'],
            /* End South Sinai ID:14 */

            /* Start Aswan ID:15 */
            ['city_id' => '15', 'ar_name' => 'أسوان', 'name' => 'Aswan'],
            ['city_id' => '15', 'ar_name' => 'أسوان الجديدة', 'name' => 'Aswan El Gedida'],
            ['city_id' => '15', 'ar_name' => 'دراو', 'name' => 'Drau'],
            ['city_id' => '15', 'ar_name' => 'كوم أمبو', 'name' => 'Kom Ombo'],
            ['city_id' => '15', 'ar_name' => 'نصر النوبة', 'name' => 'Nasr Al Nuba'],
            ['city_id' => '15', 'ar_name' => 'كلابشة', 'name' => 'Kalabsha'],
            ['city_id' => '15', 'ar_name' => 'إدفو', 'name' => 'Edfu'],
            ['city_id' => '15', 'ar_name' => 'الرديسية', 'name' => 'Al-Radisiyah'],
            ['city_id' => '15', 'ar_name' => 'البصيلية', 'name' => 'Al Basilia'],
            ['city_id' => '15', 'ar_name' => 'السباعية', 'name' => 'Al Sibaeia'],
            ['city_id' => '15', 'ar_name' => 'ابوسمبل السياحية', 'name' => 'Abo Simbl Al Siyahia'],
            ['city_id' => '15', 'ar_name' => 'مرسى علم', 'name' => 'Marsa Alam'],
            /* End Aswan ID:15 */

            /* Start Assiut ID:16 */
            ['city_id' => '16', 'ar_name' => 'أسيوط', 'name' => 'Assiut'],
            ['city_id' => '16', 'ar_name' => 'أسيوط الجديدة', 'name' => 'Assiut El Gedida'],
            ['city_id' => '16', 'ar_name' => 'ديروط', 'name' => 'Dayrout'],
            ['city_id' => '16', 'ar_name' => 'منفلوط', 'name' => 'Manfalut'],
            ['city_id' => '16', 'ar_name' => 'القوصية', 'name' => 'Qusiya'],
            ['city_id' => '16', 'ar_name' => 'أبنوب', 'name' => 'Abnoub'],
            ['city_id' => '16', 'ar_name' => 'أبو تيج', 'name' => 'Abu Tig'],
            ['city_id' => '16', 'ar_name' => 'الغنايم', 'name' => 'El Ghanaim'],
            ['city_id' => '16', 'ar_name' => 'ساحل سليم', 'name' => 'Sahel Selim'],
            ['city_id' => '16', 'ar_name' => 'البداري', 'name' => 'El Badari'],
            ['city_id' => '16', 'ar_name' => 'صدفا', 'name' => 'Sidfa'],
            /* End Assiut ID:16 */

            /* Start Bani Sweif ID:17 */
            ['city_id' => '17', 'ar_name' => 'بني سويف', 'name' => 'Bani Sweif'],
            ['city_id' => '17', 'ar_name' => 'بني سويف الجديدة', 'name' => 'Beni Suef El Gedida'],
            ['city_id' => '17', 'ar_name' => 'الواسطى', 'name' => 'Al Wasta'],
            ['city_id' => '17', 'ar_name' => 'ناصر', 'name' => 'Naser'],
            ['city_id' => '17', 'ar_name' => 'إهناسيا', 'name' => 'Ehnasia'],
            ['city_id' => '17', 'ar_name' => 'ببا', 'name' => 'beba'],
            ['city_id' => '17', 'ar_name' => 'الفشن', 'name' => 'Fashn'],
            ['city_id' => '17', 'ar_name' => 'سمسطا', 'name' => 'Somasta'],
            ['city_id' => '17', 'ar_name' => 'الاباصيرى', 'name' => 'Alabbaseri'],
            ['city_id' => '17', 'ar_name' => 'مقبل', 'name' => 'Mokbel'],
            /* End Bani Sweif ID:17 */

            /* Start PorSaid ID:18 */
            ['city_id' => '18', 'ar_name' => 'بورسعيد', 'name' => 'PorSaid'],
            ['city_id' => '18', 'ar_name' => 'بورفؤاد', 'name' => 'Port Fouad'],
            ['city_id' => '18', 'ar_name' => 'العرب', 'name' => 'Alarab'],
            ['city_id' => '18', 'ar_name' => 'حى الزهور', 'name' => 'Zohour'],
            ['city_id' => '18', 'ar_name' => 'حى الشرق', 'name' => 'Alsharq'],
            ['city_id' => '18', 'ar_name' => 'حى الضواحى', 'name' => 'Aldawahi'],
            ['city_id' => '18', 'ar_name' => 'حى المناخ', 'name' => 'Almanakh'],
            ['city_id' => '18', 'ar_name' => 'حى مبارك', 'name' => 'Mubarak'],
            /* End PorSaid ID:18 */

            /* Start Damietta ID:19 */
            ['city_id' => '19', 'ar_name' => 'دمياط', 'name' => 'Damietta'],
            ['city_id' => '19', 'ar_name' => 'دمياط الجديدة', 'name' => 'New Damietta'],
            ['city_id' => '19', 'ar_name' => 'رأس البر', 'name' => 'Ras El Bar'],
            ['city_id' => '19', 'ar_name' => 'فارسكور', 'name' => 'Faraskour'],
            ['city_id' => '19', 'ar_name' => 'الزرقا', 'name' => 'Zarqa'],
            ['city_id' => '19', 'ar_name' => 'السرو', 'name' => 'alsaru'],
            ['city_id' => '19', 'ar_name' => 'الروضة', 'name' => 'alruwda'],
            ['city_id' => '19', 'ar_name' => 'كفر البطيخ', 'name' => 'Kafr El-Batikh'],
            ['city_id' => '19', 'ar_name' => 'عزبة البرج', 'name' => 'Azbet Al Burg'],
            ['city_id' => '19', 'ar_name' => 'ميت أبو غالب', 'name' => 'Meet Abou Ghalib'],
            ['city_id' => '19', 'ar_name' => 'كفر سعد', 'name' => 'Kafr Saad'],
            /* End Damietta ID:19 */

            /* Start Sharqia ID:20 */
            ['city_id' => '20', 'ar_name' => 'الزقازيق', 'name' => 'Zagazig'],
            ['city_id' => '20', 'ar_name' => 'العاشر من رمضان', 'name' => 'Al Ashr Men Ramadan'],
            ['city_id' => '20', 'ar_name' => 'منيا القمح', 'name' => 'Minya Al Qamh'],
            ['city_id' => '20', 'ar_name' => 'بلبيس', 'name' => 'Belbeis'],
            ['city_id' => '20', 'ar_name' => 'مشتول السوق', 'name' => 'Mashtoul El Souq'],
            ['city_id' => '20', 'ar_name' => 'القنايات', 'name' => 'Qenaiat'],
            ['city_id' => '20', 'ar_name' => 'أبو حماد', 'name' => 'Abu Hammad'],
            ['city_id' => '20', 'ar_name' => 'القرين', 'name' => 'El Qurain'],
            ['city_id' => '20', 'ar_name' => 'ههيا', 'name' => 'Hehia'],
            ['city_id' => '20', 'ar_name' => 'أبو كبير', 'name' => 'Abu Kabir'],
            ['city_id' => '20', 'ar_name' => 'فاقوس', 'name' => 'Faccus'],
            ['city_id' => '20', 'ar_name' => 'الصالحية الجديدة', 'name' => 'El Salihia El Gedida'],
            ['city_id' => '20', 'ar_name' => 'الإبراهيمية', 'name' => 'Al Ibrahimiyah'],
            ['city_id' => '20', 'ar_name' => 'ديرب نجم', 'name' => 'Deirb Negm'],
            ['city_id' => '20', 'ar_name' => 'كفر صقر', 'name' => 'Kafr Saqr'],
            ['city_id' => '20', 'ar_name' => 'أولاد صقر', 'name' => 'Awlad Saqr'],
            ['city_id' => '20', 'ar_name' => 'الحسينية', 'name' => 'Husseiniya'],
            ['city_id' => '20', 'ar_name' => 'صان الحجر القبلية', 'name' => 'san alhajar alqablia'],
            ['city_id' => '20', 'ar_name' => 'منشأة أبو عمر', 'name' => 'Manshayat Abu Omar'],
            /* End Sharqia ID:20 */

            /* Start South Sinai ID:21 */
            ['city_id' => '21', 'ar_name' => 'الطور', 'name' => 'Al Toor'],
            ['city_id' => '21', 'ar_name' => 'شرم الشيخ', 'name' => 'Sharm El-Shaikh'],
            ['city_id' => '21', 'ar_name' => 'دهب', 'name' => 'Dahab'],
            ['city_id' => '21', 'ar_name' => 'نويبع', 'name' => 'Nuweiba'],
            ['city_id' => '21', 'ar_name' => 'طابا', 'name' => 'Taba'],
            ['city_id' => '21', 'ar_name' => 'سانت كاترين', 'name' => 'Saint Catherine'],
            ['city_id' => '21', 'ar_name' => 'أبو رديس', 'name' => 'Abu Redis'],
            ['city_id' => '21', 'ar_name' => 'أبو زنيمة', 'name' => 'Abu Zenaima'],
            ['city_id' => '21', 'ar_name' => 'رأس سدر', 'name' => 'Ras Sidr'],
            /* End South Sinai ID:21 */

            /* Start Kafr El Sheikh ID:22 */
            ['city_id' => '22', 'ar_name' => 'كفر الشيخ', 'name' => 'Kafr El Sheikh'],
            ['city_id' => '22', 'ar_name' => 'وسط البلد كفر الشيخ', 'name' => 'Kafr El Sheikh Downtown'],
            ['city_id' => '22', 'ar_name' => 'دسوق', 'name' => 'Desouq'],
            ['city_id' => '22', 'ar_name' => 'فوه', 'name' => 'Fooh'],
            ['city_id' => '22', 'ar_name' => 'مطوبس', 'name' => 'Metobas'],
            ['city_id' => '22', 'ar_name' => 'برج البرلس', 'name' => 'Burg Al Burullus'],
            ['city_id' => '22', 'ar_name' => 'بلطيم', 'name' => 'Baltim'],
            ['city_id' => '22', 'ar_name' => 'مصيف بلطيم', 'name' => 'Masief Baltim'],
            ['city_id' => '22', 'ar_name' => 'الحامول', 'name' => 'Hamol'],
            ['city_id' => '22', 'ar_name' => 'بيلا', 'name' => 'Bella'],
            ['city_id' => '22', 'ar_name' => 'الرياض', 'name' => 'Riyadh'],
            ['city_id' => '22', 'ar_name' => 'سيدي سالم', 'name' => 'Sidi Salm'],
            ['city_id' => '22', 'ar_name' => 'قلين', 'name' => 'Qellen'],
            ['city_id' => '22', 'ar_name' => 'سيدي غازي', 'name' => 'Sidi Ghazi'],
            /* End Kafr El Sheikh ID:22 */

            /* Start Matrouh ID:23 */
            ['city_id' => '23', 'ar_name' => 'مرسى مطروح', 'name' => 'Marsa Matrouh'],
            ['city_id' => '23', 'ar_name' => 'الحمام', 'name' => 'El Hamam'],
            ['city_id' => '23', 'ar_name' => 'العلمين', 'name' => 'Alamein'],
            ['city_id' => '23', 'ar_name' => 'الضبعة', 'name' => 'Dabaa'],
            ['city_id' => '23', 'ar_name' => 'النجيلة', 'name' => 'Al-Nagila'],
            ['city_id' => '23', 'ar_name' => 'سيدي براني', 'name' => 'Sidi Brani'],
            ['city_id' => '23', 'ar_name' => 'السلوم', 'name' => 'Salloum'],
            ['city_id' => '23', 'ar_name' => 'سيوة', 'name' => 'Siwa'],
            ['city_id' => '23', 'ar_name' => 'مارينا', 'name' => 'Marina'],
            ['city_id' => '23', 'ar_name' => 'الساحل الشمالى', 'name' => 'North Coast'],
            /* End Matrouh ID:23 */

            /* Start Luxor ID:24 */
            ['city_id' => '24', 'ar_name' => 'الأقصر', 'name' => 'Luxor'],
            ['city_id' => '24', 'ar_name' => 'الأقصر الجديدة', 'name' => 'New Luxor'],
            ['city_id' => '24', 'ar_name' => 'إسنا', 'name' => 'Esna'],
            ['city_id' => '24', 'ar_name' => 'طيبة الجديدة', 'name' => 'New Tiba'],
            ['city_id' => '24', 'ar_name' => 'الزينية', 'name' => 'Al ziynia'],
            ['city_id' => '24', 'ar_name' => 'البياضية', 'name' => 'Al Bayadieh'],
            ['city_id' => '24', 'ar_name' => 'القرنة', 'name' => 'Al Qarna'],
            ['city_id' => '24', 'ar_name' => 'أرمنت', 'name' => 'Armant'],
            ['city_id' => '24', 'ar_name' => 'الطود', 'name' => 'Al Tud'],
            /* End Luxor ID:24 */

            /* Start Qena ID:25 */
            ['city_id' => '25', 'ar_name' => 'قنا', 'name' => 'Qena'],
            ['city_id' => '25', 'ar_name' => 'قنا الجديدة', 'name' => 'New Qena'],
            ['city_id' => '25', 'ar_name' => 'ابو طشت', 'name' => 'Abu Tesht'],
            ['city_id' => '25', 'ar_name' => 'نجع حمادي', 'name' => 'Nag Hammadi'],
            ['city_id' => '25', 'ar_name' => 'دشنا', 'name' => 'Deshna'],
            ['city_id' => '25', 'ar_name' => 'الوقف', 'name' => 'Alwaqf'],
            ['city_id' => '25', 'ar_name' => 'قفط', 'name' => 'Qaft'],
            ['city_id' => '25', 'ar_name' => 'نقادة', 'name' => 'Naqada'],
            ['city_id' => '25', 'ar_name' => 'فرشوط', 'name' => 'Farshout'],
            ['city_id' => '25', 'ar_name' => 'قوص', 'name' => 'Quos'],
            /* End Qena ID:25 */

            /* Start North Sinai ID:26 */
            ['city_id' => '26', 'ar_name' => 'العريش', 'name' => 'Arish'],
            ['city_id' => '26', 'ar_name' => 'الشيخ زويد', 'name' => 'Sheikh Zowaid'],
            ['city_id' => '26', 'ar_name' => 'نخل', 'name' => 'Nakhl'],
            ['city_id' => '26', 'ar_name' => 'رفح', 'name' => 'Rafah'],
            ['city_id' => '26', 'ar_name' => 'بئر العبد', 'name' => 'Bir al-Abed'],
            ['city_id' => '26', 'ar_name' => 'الحسنة', 'name' => 'Al Hasana'],
            /* End North Sinai ID:26 */

            /* Start Sohag ID:27 */
            ['city_id' => '27', 'ar_name' => 'سوهاج', 'name' => 'Sohag'],
            ['city_id' => '27', 'ar_name' => 'سوهاج الجديدة', 'name' => 'Sohag El Gedida'],
            ['city_id' => '27', 'ar_name' => 'أخميم', 'name' => 'Akhmeem'],
            ['city_id' => '27', 'ar_name' => 'أخميم الجديدة', 'name' => 'Akhmim El Gedida'],
            ['city_id' => '27', 'ar_name' => 'البلينا', 'name' => 'Albalina'],
            ['city_id' => '27', 'ar_name' => 'المراغة', 'name' => 'El Maragha'],
            ['city_id' => '27', 'ar_name' => 'المنشأة', 'name' => 'almunsha\'a'],
            ['city_id' => '27', 'ar_name' => 'دار السلام', 'name' => 'Dar AISalaam'],
            ['city_id' => '27', 'ar_name' => 'جرجا', 'name' => 'Gerga'],
            ['city_id' => '27', 'ar_name' => 'جهينة الغربية', 'name' => 'Jahina Al Gharbia'],
            ['city_id' => '27', 'ar_name' => 'ساقلته', 'name' => 'Saqilatuh'],
            ['city_id' => '27', 'ar_name' => 'طما', 'name' => 'Tama'],
            ['city_id' => '27', 'ar_name' => 'طهطا', 'name' => 'Tahta'],
            ['city_id' => '27', 'ar_name' => 'الكوثر', 'name' => 'Alkawthar'],
            /* End Sharqia ID:27 */

        ];
        DB::table('areas')->insert($data);
    }
}
