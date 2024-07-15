import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  BlogPostControllerService,
  GetAllBlogPostResponse,
} from '../../shared/services/api';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import axios from 'axios';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, TimeAgoPipe, FormsModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  blogs: GetAllBlogPostResponse[] = [];
  filteredBlogs: GetAllBlogPostResponse[] = [];
  authorImages: string[] = [];
  filterAuthor: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(
    private blogService: BlogPostControllerService,
    private change: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getBlogPosts();
    this.fetchRandomUserImages();
  }

  getBlogPosts() {
    this.blogService.getAllBlogPosts().subscribe(
      (response: GetAllBlogPostResponse[]) => {
        this.blogs = response.sort((a, b) => {
          if (a.publishedDate! > b.publishedDate!) return -1;
          if (a.publishedDate! < b.publishedDate!) return 1;
          return 0;
        });
        this.blogs = response;
        this.filteredBlogs = response;

        this.toastr.success('Successfully fetched blog posts');
      },
      (error) => {
        console.error('Error fetching blog posts:', error);
        this.toastr.error('Failed to load blog posts');
      }
    );
    this.change.markForCheck();
  }

  filterBlogs() {
    this.filteredBlogs = this.blogs.filter((blog) => {
      const matchesAuthor = blog
        .authorName!.toLowerCase()
        .includes(this.filterAuthor.toLowerCase());
      const matchesDate = this.isDateInRange(
        blog.publishedDate!,
        this.startDate,
        this.endDate
      );
      return matchesAuthor && matchesDate;
    });
  }

  isDateInRange(
    publishedDate: number[] | string,
    startDate: string,
    endDate: string
  ): boolean {
    let date: Date;

    if (Array.isArray(publishedDate)) {
      date = new Date(
        publishedDate[0],
        publishedDate[1] - 1, // Month starts from 0
        publishedDate[2],
        publishedDate[3],
        publishedDate[4],
        publishedDate[5]
      );
    } else {
      date = new Date(publishedDate);
    }

    if (isNaN(date.getTime())) {
      console.error('Invalid date format:', publishedDate);
      return false;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    date.setHours(0, 0, 0, 0);
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(0, 0, 0, 0);

    return (!start || date >= start) && (!end || date <= end);
  }

  fetchRandomUserImages() {
    axios
      .get('https://api.randomuser.me/0.2/?results=5')
      .then((response) => {
        this.authorImages = response.data.results.map(
          (result: any) => result.user.picture
        );
        this.change.markForCheck();
      })
      .catch((error) => {
        console.error('Error fetching random user images:', error);
        this.toastr.error('Failed to load random user images');
      });
  }
}
