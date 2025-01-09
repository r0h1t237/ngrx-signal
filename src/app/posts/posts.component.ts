import { Component, computed, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from './services/posts.service';
import { patchState, signalState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { PostInterface } from './types/post.interface';
import { CommonModule } from '@angular/common';
import { pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';


export const PostsStore = signalStore(
  withState<PostsStateInterface>({
    posts: [],
    isLoading: false,
    error: null,
  }),
  withComputed((store) => ({
    postsCount: computed(() => store.posts().length),
  })),
  withMethods((store, postsService = Inject(PostsService)) => ({
    addPost(title: string) {
      const newPost: PostInterface = {
        id: crypto.randomUUID(),
        title,
      }
      const updatedPosts = [...store.posts(), newPost];
      patchState(store, { posts: updatedPosts });
    },
    removePost(id: string) {
      const updatedPosts = store.posts().filter((post) => post.id !== id);
      patchState(store, { posts: updatedPosts });
    },
    addPosts(posts: PostInterface[]) {
      patchState(store, { posts });
    },
    // loadPosts: rxMethod<void>(
    //   pipe(
    //     switchMap(() => {
    //       return postsService.getPosts().pipe(
    //         tap((posts: PostInterface[]) => {
    //           patchState(store, { posts });
    //         }),
    //       )
    //     })
    //   )
    // ),
  })),
  withHooks({
    onInit(store) {
      // store.loadPosts();
    }
  })

)

export interface PostsStateInterface {
  posts: PostInterface[];
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-posts',
  standalone: true,
  providers: [PostsService, PostsStore],
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  fb = inject(FormBuilder)
  postsService = inject(PostsService);
  store = inject(PostsStore);

  addForm = this.fb.nonNullable.group({
    title: '',
  });

  ngOnInit(): void {
    this.postsService.getPosts().subscribe((posts) => {
      this.store.addPosts(posts);
    });
  }
  // state = signalState<PostsStateInterface>({
  //   posts: [],
  //   error: null,
  //   isLoading: false,
  // });

  // postsCount = computed(() => this.state().posts.length);


  // onAdd() {
  //   const newPost: PostInterface = {
  //     id: crypto.randomUUID(),
  //     title: this.addForm.getRawValue().title
  //   }
  //   const updatedPosts = [...this.state.posts(), newPost];
  //   patchState(this.state,(state)=>({...state, posts: updatedPosts}));
  //   this.addForm.reset();
  // }

  // removePost(id: string) {
  //   const updatedPosts = this.state.posts().filter((post) => post.id !== id);
  //   patchState(this.state,(state)=>({...state, posts: updatedPosts}));
  // }



  onAdd() {
    this.store.addPost(this.addForm.getRawValue().title);
    this.addForm.reset();
  }


}


