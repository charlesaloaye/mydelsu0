<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Http;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

class HomePage extends Component
{
    // #[Layout('components.HomeLayout')]

    #[Title('Home')]
    public function render()
    {
        $url = 'https://mydelsu.com/wp-json/wp/v2/posts?per_page=5&_embed';
        $response = Http::get($url);
        $posts = $response->json();
        return view('livewire.home-page', [
            'posts' => $posts
        ]);
    }
}
