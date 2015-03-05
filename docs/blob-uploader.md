# Forms: Blob Uploader

- blob = arbitrarily-long, possibly-binary data e.g. images, PDFs, etc


## Why are these such a big deal?

- blobs can occupy large amounts of RAM on client devices, which can lead to
  crashes and/or app termination

- blobs can occupy large amounts of persistent storage on client devices, which
  can increase form-record load times and potentially run afoul of disk quotas

- even small blobs can cause network transfers to take much, much longer than
  otherwise, increasing the window for network failure


## What do we do about this?

1. opportunistically offload these blobs to the server when possible, retaining
  a thumbnail (if an image) and a reference to the blob

    - the thumbnail is a great visual aid for end-users

2. instead of transferring all data in one final form-record submission, we can
  just transfer the references to the blobs (along with any non-blob data)

3. before doing anything else, the server replaces any blob references with the
  uploaded blob data from before

4. now the server is working with monolithic form record data, with no hint that
  we ever split it up in the first place


## Security

- you may submit blobs to the server, but there is no endpoint or method or
  retrieve that blob from the client, even armed with the identifiers

- the server expires a blob after a period of time (default = 2 weeks)

- even in browsers / webviews where the filename is retrievable, we drop it
  in favour of anonymous UUIDs


## `BlinkFormBlob`

- @constructor

There is no such constructor, but we record this here to document the data
structure.

- @prop {String} answerSpace - the unique name of the associated answerSpace
- @prop {String} tuple - a UUID used to identify the associated form record
- @prop {String} [blob] - a UUID used to identify this blob (default = new UUID)
- @prop {String} [mime] - the MIME type, e.g. "image/jpeg"
- @prop {String} file - the Base64-encoded contents, _NOT_ a Data URI
- @prop {Number} [size]

We use the answerSpace and tuple identifiers to determine how and where to
store the blob. These will be available in the final form-record submission, to
help the server reunite the record data with its own blobs.


## `BlinkFormSavedBlob`

- @constructor
- @see {BlinkFormBlob}

Like `BlinkFormBlob`, but this is how the server responds.

- @prop {String} blob - a UUID used to identify this blob
- @prop {String} mime - the MIME type from before, but potentially more accurate
- @prop {String} [file] - the Base64-encoded contents, _NOT_ a Data URI
- @prop {Number} size
- @prop {Number} [width] - thumbnail width (if data is a thumbnail)
- @prop {Number} [height] - thumbnail height  (if data is a thumbnail)

The new data is often a thumbnail _if_ the original blob was an image.


## `blobUploader`

- is an instance of [`events.EventEmitter`](http://nodejs.org/api/events.html#events_class_events_eventemitter)

    - has `on`, `once`, `emit`, etc methods from `events.EventEmitter`

- wrapper around [`async.priorityQueue`](https://github.com/caolan/async#priorityQueue)

- `async.priorityQueue` is itself a wrapper around
  [`async.queue`](https://github.com/caolan/async#queue)

    - we expose the `length`, `idle`, `pause`, `resume`, `running` methods from
      `async.queue`

    - we emit the "empty", "drain", "saturated" events from `async.queue`

### `setXHR()`

- @param {Function} xhr an [xhr](https://github.com/Raynos/xhr)-compatible Function
- @returns {Function} the new value if valid, or the unchanged value

This is primarily for testing purposes, but could be useful for extensibility.

### `setConcurrency()`

- @param {Number} concurrency (default = 3), number of tasks in parallel
- @returns {Number} the new value if valid, or the unchanged value

### `setEndpoint()`

- @param {String} url to use when performing the upload
- @returns {String} the new value if valid, or the unchanged value

Set the endpoint URL before trying to perform any uploads, otherwise bad things
will happen.

### `saveBlob()`

- @param {BlinkFormBlob} blob
- @param {Function} callback - function (Error, BlinkFormSavedBlob)
- @fires empty - the queue no longer contains queued uploads
- @fires drain - the queue no longer contains queued or active uploads
- @fires saturated - reached the concurrency limit
