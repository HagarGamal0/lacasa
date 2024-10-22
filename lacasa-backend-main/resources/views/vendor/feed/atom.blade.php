<?=
    /* Using an echo tag here so the `<? ... ?>` won't get parsed as short tags */
    '<?xml version="1.0" encoding="UTF-8"?>'.PHP_EOL
?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="{{ $meta['language'] }}">
    @foreach($meta as $key => $metaItem)
        @if($key === 'link')
            <{{ $key }} href="{{ url($metaItem) }}" rel="self"></{{ $key }}>
        @elseif($key === 'title')
            <{{ $key }}>{!! \Spatie\Feed\Helpers\Cdata::out($metaItem) !!}</{{ $key }}>
        @elseif($key === 'description')
            <subtitle>{{ $metaItem }}</subtitle>
        @elseif($key === 'language')
        @elseif($key === 'image')
@if(!empty($metaItem))
            <logo>{!! $metaItem !!}</logo>
@else

@endif
        @else
            <{{ $key }}>{{ $metaItem }}</{{ $key }}>
        @endif
    @endforeach
    @foreach($items as $item)
        <entry>
            <title>{!! \Spatie\Feed\Helpers\Cdata::out($item->title) !!}</title>
            <link>{{ $item->link }}</link>
            <id>{{ $item->id }}</id>
            <image_link>{{ $item->image }}</image_link>
            <price>{{ $item->price }}</price>
            <sale_price>{{ $item->sale_price }}</sale_price>
            <availability>{{ $item->availability }}</availability>
            <description>{{ $item->summary }}</description>
            <author>
                <name>{!! \Spatie\Feed\Helpers\Cdata::out($item->authorName) !!}</name>
@if(!empty($item->authorEmail))
                <email>{!! \Spatie\Feed\Helpers\Cdata::out($item->authorEmail) !!}</email>

@endif
            </author>
            @if($item->__isset('enclosure'))
            <link href="{{ url($item->enclosure) }}" length="{{ $item->enclosureLength }}" type="{{ $item->enclosureType }}" />
            @endif
            @foreach($item->category as $category)
            <category term="{{ $category }}" />
            @endforeach
            <updated>{{ $item->timestamp() }}</updated>
        </entry>
    @endforeach
</feed>
