"use client";

export default function ContactDetailsCard() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // later: API call or save logic
    console.log("Contact details updated");
  };

  return (
    <div className="card table-card">
      <div className="card-header pb-0">
        <h4>Contact Details</h4>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">

            {/* Office Address */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Office Address</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="50/5E, Harish Mukherjee Road, Kolkata 700025"
                />
              </div>
            </div>

            {/* Phone 1 */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Phone 1</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="+91 891-040-7548"
                />
              </div>
            </div>

            {/* Phone 2 */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Phone 2</label>
                <input type="text" className="form-control" />
              </div>
            </div>

            {/* Phone 3 */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Phone 3</label>
                <input type="text" className="form-control" />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="col-md-6">
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="918910407548"
                />
              </div>
            </div>

            {/* Email 1 */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Email 1</label>
                <input
                  type="email"
                  className="form-control"
                  defaultValue="sales@branditconsultancy.in"
                />
              </div>
            </div>

            {/* Email 2 */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Email 2</label>
                <input
                  type="email"
                  className="form-control"
                  defaultValue="thinkbrandit@gmail.com"
                />
              </div>
            </div>

            {/* Email 3 */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Email 3</label>
                <input
                  type="email"
                  className="form-control"
                  defaultValue="career@branditconsultancy.in"
                />
              </div>
            </div>

            {/* Facebook */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="url"
                  className="form-control"
                  defaultValue="https://www.facebook.com/BrandITConsultancy/"
                />
              </div>
            </div>

            {/* Twitter */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Twitter</label>
                <input type="url" className="form-control" />
              </div>
            </div>

            {/* Instagram */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  className="form-control"
                  defaultValue="https://www.instagram.com/brandit_consultancy/"
                />
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="text-right mt-3">
            <button type="submit" className="btn btn-primary">
              Update Contact Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
