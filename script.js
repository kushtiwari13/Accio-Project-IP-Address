const ipAddress = document.getElementById("ip");
const map = document.getElementById("map");
const lat = document.getElementById("lat");
const long = document.getElementById("long");
const city = document.getElementById("city");
const region = document.getElementById("region");
const organisation = document.getElementById("organisation");
const hostname = document.getElementById("hostname");
const timezone = document.getElementById("timezone");
const dateandtime = document.getElementById("dateandtime");
const pincode = document.getElementById("pincode");
const messege = document.getElementById("messege");

const postOfficeList = document.getElementById("post-office-list");
const searchInput = document.getElementById("search-input");
const message = document.getElementById("message");
const searchbox = document.getElementById("search-box");

window.addEventListener("load", function () {
  message.style.display = "block";
  setTimeout(function () {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        ipAddress.innerText = data.ip;
        ipAddress.style.color = "white";
        message.style.display = "none";
      });
  }, 1000);
});

function showMap(latitude, longitude) {
  const div = document.createElement("div");
  div.innerHTML = `<iframe id="iframe" src="https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed"
    width="100%" height="500" frameborder="0" style="border:0; "></iframe>`;
  map.appendChild(div);
  document.getElementById("more-info").style.display = "block";
}
if (!showMap) {
  message.style.display = "none";
} else {
  message.style.display = "block";
}

function getIP(json) {
  document.getElementById("location").style.display = "block";
  var ip = json.ip;

  fetch(`https://ipinfo.io/${ip}/json?token=a791bcb3f533e0`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var loc = data.loc.split(",");
      var latitude = parseFloat(loc[0]);
      var longitude = parseFloat(loc[1]);
      let pin = data.postal;
      console.log(latitude, longitude);

      let time = new Date().toLocaleString("en-US", `${data.timezone}`);
      console.log(time);

      lat.innerHTML = `<strong>Latitude:</strong>  ${latitude}`;
      long.innerHTML = `<strong>Longitude:</strong>  ${longitude}`;
      city.innerHTML = `<strong>City:</strong> ${data.city}`;
      region.innerHTML = `<strong>Region:</strong>  ${data.country}`;
      organisation.innerHTML = `<strong>Organization:</strong> ${data.org}`;
      hostname.innerHTML = `<strong>Host Name:</strong> N/A`;
      timezone.innerHTML = `<strong>Time-Zone:</strong> ${data.timezone}`;
      dateandtime.innerHTML = `<strong>Date-and-Time:</strong> ${time}`;
      pincode.innerHTML = `<strong>Pincode:</strong> ${data.postal}`;

      let postOffices = [];

      function fetchPostOffices() {
        fetch(`https://api.postalpincode.in/pincode/${pin}`)
          .then((response) => response.json())
          .then((data) => {
            postOffices = data[0].PostOffice;
            messege.innerHTML = `<strong>Message:</strong> ${data[0].Message}`;
            displayPostOffices(postOffices);

            document.getElementById("post-office-heading").style.display =
              "block";
          })
          .catch((error) => {
            console.error(error);
          });
      }
      fetchPostOffices();
      if (postOffices) {
        message.style.display = "none";
      } else {
        message.style.display = "block";
      }

      function displayPostOffices(postOffices) {
        postOfficeList.innerHTML = "";

        postOffices.forEach((postOffice) => {
          const item = document.createElement("div");
          item.innerHTML = `
                    <div class="card" id="card">
                        <div>
                            <span id="name"><strong>Name:</strong> ${postOffice.Name}</span><br>
                            <span id="branch-type"><strong>Branch Type:</strong> ${postOffice.BranchType} </span>
                            <br>
                            <span><strong>Delivery Status:</strong> ${postOffice.DeliveryStatus}</span>
                            <br>
                            <span><strong>District:</strong> ${postOffice.District}</span>
                            <br>
                            <span><strong>Division:</strong> ${postOffice.Division}</span>
                        </div>
                    </div>
                            `;

          postOfficeList.appendChild(item);
        });
      }

      const searchInput = document.getElementById("search-input");

      function filterPostOffices() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredPostOffices = postOffices.filter(
          (postOffice) =>
            postOffice.Name.toLowerCase().includes(searchTerm) ||
            postOffice.BranchType.toLowerCase().includes(searchTerm)
        );

        if (filteredPostOffices.length === 0) {
          postOfficeList.innerHTML = "<p>No results found</p>";
        } else {
          displayPostOffices(filteredPostOffices);
        }
      }

      searchInput.addEventListener("input", () => {
        filterPostOffices(postOffices);
      });

      fetchPostOffices();

      showMap(latitude, longitude);
    });
}

const fetchBtn = document.getElementById("btn");

function onFetchBtnClick() {
  document.querySelector(".container").style.display = "none";

  message.style.display = "block";

  setTimeout(function () {
    message.style.display = "none";
    fetchBtn.style.display = "none";
    searchbox.style.display = "block";
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://api.ipify.org?format=jsonp&callback=getIP";
    document.head.appendChild(script);
  }, 2000);
}

fetchBtn.addEventListener("click", onFetchBtnClick);
