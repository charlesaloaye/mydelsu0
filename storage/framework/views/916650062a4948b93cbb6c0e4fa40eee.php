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

    <!--[if BLOCK]><![endif]--><?php $__currentLoopData = $posts; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $post): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <?php
            $featuredImage = $post['_embedded']['wp:featuredmedia'][0]['source_url'] ?? null;
            $fallbackImage = asset('images/placeholder.jpg');
            $excerpt = strip_tags($post['excerpt']['rendered']);
            $words = explode(' ', $excerpt);
            $truncatedExcerpt = implode(' ', array_slice($words, 0, 25)) . (count($words) > 25 ? '...' : '');
        ?>
        <a href="<?php echo e($post['link']); ?>" class="text-decoration-none">

            <div class="d-flex align-items-start mb-4 border-bottom pb-3">
                <img src="<?php echo e($featuredImage ?? $fallbackImage); ?>" onerror="this.src='<?php echo e($fallbackImage); ?>';"
                    alt="Post image" class="flex-shrink-0 me-3 rounded"
                    style="width: 100px; height: 100px; object-fit: cover;">

                <div>
                    <h5 class="mb-1 text-black"><?php echo $post['title']['rendered']; ?></h5>
                    <p class="mb-1 text-muted small"><?php echo e($truncatedExcerpt); ?></p>
                    
                </div>
            </div>
        </a>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><!--[if ENDBLOCK]><![endif]-->



</div>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/components/home/home-news.blade.php ENDPATH**/ ?>