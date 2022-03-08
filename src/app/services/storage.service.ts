import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  uploadFile(event: any, photoPath: string): Observable<UploadTaskSnapshot> {
    const file = event.target.files[0];
    const filePath = photoPath;
    return from(this.storage.upload(filePath, file));
  }

  getPhoto(photoPath: string): Observable<any> {
    const ref = this.storage.refFromURL(photoPath);
    return ref.getDownloadURL();
  }

  deletePhoto(photoPath: string): Observable<any> {
    const ref = this.storage.refFromURL(photoPath);
    return ref.delete();
  }
}
