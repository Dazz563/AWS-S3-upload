import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import imageCompression from 'browser-image-compression';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'AWS-S3-upload';
    imagePreview = '';
    file: File;
    compressedFile: File;
    form: FormGroup;

    constructor(
        private http: HttpClient //
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            imageUrl: new FormControl(null, Validators.required),
        });
    }

    async onImagePicked(event: Event) {
        this.file = (event.target as HTMLInputElement).files[0];
        console.log('originalFile instanceof Blob', this.file instanceof Blob); // true
        console.log(`originalFile size ${this.file.size / 1024 / 1024} MB`); // smaller than maxSizeMB

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        try {
            this.compressedFile = await imageCompression(this.file, options);
            console.log('compressedFile instanceof Blob', this.compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${this.compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

            //await uploadToServer(compressedFile); // write your own logic
        } catch (error) {
            console.log(error);
        }

        // Convert image to url
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(this.file);
    }
    onUploadImage() {
        // Req to get presigned URL
        this.http.get<{key: string; url: string}>('http://localhost:8000/api/upload').subscribe((res) => {
            console.log(res);
            // We can assign the string to a formControl name for OUR DB
            this.form.patchValue({
                'imageUrl': res.key,
            });
            this.form.get('imageUrl').updateValueAndValidity();

            // Req to use presigned URL and send image to AWS
            this.http
                .put(res.url, this.compressedFile, {
                    headers: {
                        'Content-Type': 'image/jpeg',
                    },
                })
                .subscribe((res) => {
                    console.log(res);
                });
        });
    }
}
