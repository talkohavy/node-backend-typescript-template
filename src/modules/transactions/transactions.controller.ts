import { Application, Request, Response } from 'express';
import { createWriteStream } from 'fs';
import { join } from 'path';

export class TransactionsController {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async uploadFile() {
    this.app.post('/transactions/upload-file', (req: Request, res: Response): any => {
      this.handleFileUpload(req, res);
    });
  }

  private handleFileUpload(req: Request, res: Response) {
    try {
      const contentType = req.headers['content-type'];

      if (!contentType) {
        return res.status(400).json({ message: 'Missing content-type header' });
      }

      if (contentType.startsWith('multipart/form-data')) {
        const boundary = contentType.split('boundary=')[1];

        if (!boundary) {
          return res.status(400).json({ message: 'Invalid content-type header' });
        }

        let buffer = Buffer.alloc(0);
        const metadataArr: Array<any> = [];
        let currentFileStream: any = null;
        let currentMetadata: any = null;

        req.on('data', (chunk) => {
          buffer = Buffer.concat([buffer, chunk]);

          while (true) {
            const boundaryIndex = buffer.indexOf(`--${boundary}`);
            if (boundaryIndex === -1) break;

            const partEndIndex = buffer.indexOf('\r\n\r\n', boundaryIndex);
            if (partEndIndex === -1) break;

            const headers = buffer.subarray(boundaryIndex, partEndIndex).toString();
            const contentDispositionMatch = headers.match(/Content-Disposition: form-data;.*filename="([^"]*)"/);
            const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]*)/);

            if (contentDispositionMatch) {
              const filename = contentDispositionMatch[1]!;
              const filePath = join(process.cwd(), filename);

              if (currentFileStream) {
                currentFileStream.end();
              }

              currentFileStream = createWriteStream(filePath);
              currentMetadata = {
                filename,
                fileType: contentTypeMatch ? contentTypeMatch[1] : 'unknown',
                uploadPath: filePath,
                uploadTimestamp: new Date().toISOString(),
              };

              metadataArr.push(currentMetadata);
            }

            const contentStartIndex = partEndIndex + 4;
            const nextBoundaryIndex = buffer.indexOf(`--${boundary}`, contentStartIndex);

            if (nextBoundaryIndex !== -1) {
              const fileContent = buffer.subarray(contentStartIndex, nextBoundaryIndex - 2);
              if (currentFileStream) {
                currentFileStream.write(fileContent);
              }
              buffer = buffer.subarray(nextBoundaryIndex);
            } else {
              buffer = buffer.subarray(contentStartIndex);
              break;
            }
          }
        });

        req.on('end', () => {
          if (currentFileStream) {
            currentFileStream.end();
          }
          res.status(200).json({ message: 'Files uploaded successfully', metadata: metadataArr });
        });

        req.on('error', (err) => {
          if (currentFileStream) {
            currentFileStream.end();
          }
          res.status(500).json({ message: 'Error during file upload', error: err.message });
        });
      } else {
        // Handle binary file upload
        const filename = req.headers['x-filename'] || 'uploaded-file';
        const filePath = join(process.cwd(), filename as string);

        const writeStream = createWriteStream(filePath);
        const metadata: any = {
          filename,
          fileType: contentType,
          uploadPath: filePath,
          uploadTimestamp: new Date().toISOString(),
        };

        req.pipe(writeStream);

        writeStream.on('finish', () => {
          res.status(200).json({ message: 'File uploaded successfully', metadata });
        });

        writeStream.on('error', (err) => {
          res.status(500).json({ message: 'Error saving file', error: err.message });
        });
      }
    } catch (error: any) {
      console.log('Error during file upload:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  attachRoutes() {
    this.uploadFile();
  }
}
