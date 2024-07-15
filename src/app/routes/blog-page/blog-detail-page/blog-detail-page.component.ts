import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from '../../../shared/layouts/home-layout/home-layout.component';
import { FormsModule } from '@angular/forms';
import {
  BlogPostControllerService,
  CommentControllerService,
  CreateCommentRequestParams,
  GetAllBlogPostResponse,
  GetAllCommentResponse,
  GetBlogPostByIdResponse,
  UpdateCommentRequestParams,
  UserControllerService,
} from '../../../shared/services/api';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { ConfirmationPopUpComponent } from '../../../shared/components/confirmation-pop-up/confirmation-pop-up.component';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    HomeLayoutComponent,
    FormsModule,
    TimeAgoPipe,
    RouterModule,
    ConfirmationPopUpComponent,
  ],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
})
export class BlogDetailPageComponent implements OnInit {
  post!: GetBlogPostByIdResponse;
  comments: GetAllCommentResponse[] = [];
  blogs: GetAllBlogPostResponse[] = [];
  newComment: string = '';
  editCommentId: number | null = null;
  deletingBlogId: number | null = null;
  isEditing: boolean = false;
  userId!: number;
  showDeleteConfirmation: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogPostControllerService,
    private commentService: CommentControllerService,
    private userService: UserControllerService,
    private authService: AuthService,
    private toastr: ToastrService,
    private change: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBlogPost(parseInt(id, 10));
      this.loadComments(parseInt(id, 10));
    }
    this.authService.getUser().subscribe((user) => {
      this.userId = user.id!;
    });
  }

  getBlogPosts() {
    this.blogService.getAllBlogPosts().subscribe(
      (response: GetAllBlogPostResponse[]) => {
        this.blogs = response;
        console.log('this.blogs', this.blogs);

        this.toastr.success('Successfully fetched blog posts');
      },
      (error) => {
        console.error('Error fetching blog posts:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        this.toastr.error('Failed to load blog posts');
      }
    );
    this.change.markForCheck();
  }

  loadBlogPost(id: number): void {
    this.blogService.getBlogPostById({ id }).subscribe(
      (data) => {
        this.post = data;
      },
      (error) => {
        console.error('Error fetching blog post:', error);
        this.toastr.error('Failed to load blog post');
      }
    );
  }

  deleteBlogPost(id: number) {
    this.deletingBlogId = id;
    this.showDeleteConfirmation = true;
  }

  onDeleteConfirm() {
    if (this.deletingBlogId !== null) {
      this.blogService.deleteBlogPost({ id: this.deletingBlogId }).subscribe({
        next: () => {
          this.getBlogPosts();
          this.router.navigate(['/management/blog']);
          this.toastr.success('Blog post deleted successfully', 'Delete');
        },
        error: (error) => {
          if (error.status === 403) {
            this.toastr.error(
              'You do not have permission to delete this post.'
            );
            setTimeout(() => {
              this.router.navigate(['/management/blog']);
            }, 2000);
          } else {
            this.toastr.error('Failed to delete the blog post.');
          }
        },
        complete: () => this.resetDeleteConfirmation(),
      });
    } else {
      this.resetDeleteConfirmation();
    }
  }

  onDeleteCancel() {
    this.resetDeleteConfirmation();
  }

  private resetDeleteConfirmation() {
    this.deletingBlogId = null;
    this.showDeleteConfirmation = false;
  }

  loadComments(postId: number): void {
    this.commentService.getAllComments().subscribe(
      (data) => {
        this.comments = data.filter((comment) => comment.blogPostId === postId);
      },
      (error) => {
        console.error('Error fetching comments:', error);
        this.toastr.error('Failed to load comments');
      }
    );
  }

  createComment(): void {
    if (this.newComment.trim()) {
      const commentRequest: CreateCommentRequestParams = {
        createCommentRequest: {
          blogPostId: this.post.id!,
          userId: this.userId,
          content: this.newComment,
        },
      };

      this.commentService.createComment(commentRequest).subscribe(
        (response) => {
          this.comments.push(response);
          this.newComment = '';
          this.toastr.success('Comment added successfully');
        },
        (error) => {
          console.error('Error creating comment:', error);
          this.toastr.error('Failed to add comment');
        }
      );
    }
  }

  editComment(comment: GetAllCommentResponse): void {
    this.editCommentId = comment.id!;
    this.newComment = comment.content!;
    this.isEditing = true;
  }

  updateComment(): void {
    if (this.editCommentId !== null && this.newComment.trim()) {
      const updateRequest: UpdateCommentRequestParams = {
        updateCommentRequest: {
          id: this.editCommentId!,
          content: this.newComment,
        },
      };

      this.commentService.updateComment(updateRequest).subscribe(
        (response) => {
          const index = this.comments.findIndex(
            (comment) => comment.id === this.editCommentId
          );
          if (index !== -1) {
            this.comments[index] = response;
          }
          this.resetCommentForm();
          this.toastr.success('Comment updated successfully');
        },
        (error) => {
          console.error('Error updating comment:', error);
          this.toastr.error('Failed to update comment');
        }
      );
    }
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment({ id: commentId }).subscribe(
      () => {
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
        this.toastr.success('Comment deleted successfully');
      },
      (error) => {
        console.error('Error deleting comment:', error);
        this.toastr.error('Failed to delete comment');
      }
    );
  }

  private resetCommentForm(): void {
    this.newComment = '';
    this.editCommentId = null;
    this.isEditing = false;
  }

  getImageUrl(authorId: number): string {
    const imageUrls: { [key: number]: string } = {
      1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      3: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      4: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      5: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      6: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      7: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      8: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      9: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      10: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      11: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      12: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      13: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      14: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      15: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      16: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      17: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      18: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      19: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      20: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    };

    return imageUrls[authorId] || '';
  }
}
