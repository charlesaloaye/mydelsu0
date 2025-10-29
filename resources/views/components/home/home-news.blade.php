<div class="section-title">
    <span>News Feed</span>
    <a href="#">See All</a>
</div>

<div class="news-tabs">
    <div class="news-tab active">DELSU News</div>
    <div class="news-tab">Scholarships</div>
    <div class="news-tab">Soccer</div>
    <div class="news-tab">Entertainment</div>
    <div class="news-tab">Movies</div>
</div>

<div class="news-container">

    @foreach ($posts as $post)
        @php
            $featuredImage = $post['_embedded']['wp:featuredmedia'][0]['source_url'] ?? null;
            $fallbackImage = asset('images/placeholder.jpg');
            $excerpt = strip_tags($post['excerpt']['rendered']);
            $words = explode(' ', $excerpt);
            $truncatedExcerpt = implode(' ', array_slice($words, 0, 25)) . (count($words) > 25 ? '...' : '');
        @endphp
        <a href="{{ $post['link'] }}" class="text-decoration-none">

            <div class="d-flex align-items-start mb-4 border-bottom pb-3">
                <img src="{{ $featuredImage ?? $fallbackImage }}" onerror="this.src='{{ $fallbackImage }}';"
                    alt="Post image" class="flex-shrink-0 me-3 rounded"
                    style="width: 100px; height: 100px; object-fit: cover;">

                <div>
                    <h5 class="mb-1 text-black">{!! $post['title']['rendered'] !!}</h5>
                    <p class="mb-1 text-muted small">{{ $truncatedExcerpt }}</p>
                    {{-- <a href="{{ $post['link'] }}" target="_blank" class="btn btn-sm btn-outline-primary">Read more</a> --}}
                </div>
            </div>
        </a>
    @endforeach



</div>
