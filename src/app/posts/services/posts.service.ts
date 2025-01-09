import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { PostInterface } from "../types/post.interface";

@Injectable({
    providedIn: "root"
})

export class PostsService {
    getPosts(): Observable<PostInterface[]> {
        const posts = [
            { id: '1', title: 'Post 1' },
            { id: '2', title: 'Post 2' },
            { id: '3', title: 'Post 3' },
        ];
        return of(posts).pipe(delay(2000));
    }
}