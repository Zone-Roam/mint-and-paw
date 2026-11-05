import { IMG } from "@/content/images";
import { SITE } from "@/content/site";

function Dots({ on, of = 5 }: { on: number; of?: number }) {
  return (
    <span className="dots" role="img" aria-label={`${on} of ${of}`}>
      {Array.from({ length: of }, (_, i) => (
        <i key={i} className={i < on ? "on" : undefined} />
      ))}
    </span>
  );
}

export function ToyOfTheMonth() {
  return (
    <section className="totm rv" aria-labelledby="totmH">
      <div className="pic">
        <img src={IMG.ropeMouseMoss} alt="A green and white striped rope mouse toy" />
      </div>
      <div className="copy">
        <span className="pill">Toy of the month</span>
        <h2 className="fat" id="totmH">
          The Stripy
          <br />
          Mouse
        </h2>
        <p>Rope-wrapped body, a crinkly tail and a pinch of catnip inside.</p>
        <div className="meters">
          <div className="meter">Crinkle <Dots on={4} /></div>
          <div className="meter">Toughness <Dots on={3} /></div>
          <div className="meter">Catnip <span>Yes</span></div>
        </div>
        <a className="btn" href="#join">Tell me when it drops</a>
      </div>
    </section>
  );
}

const PETS = [
  { src: IMG.dachshund, label: "Dachshund" },
  { src: IMG.gingerCat, label: "Ginger cat" },
  { src: IMG.golden, label: "Golden" },
];

export function PetWall() {
  return (
    <section className="blk" style={{ textAlign: "center" }} aria-labelledby="wallH">
      <h2 className="h2 fat rv" id="wallH">
        Starring:
        <br />
        your pet.
      </h2>
      <p className="rv" style={{ fontSize: 19, fontWeight: 700, marginTop: 18 }}>
        Post them with <b>#{SITE.hashtag}</b> and they could end up right here.
      </p>
      <div className="wall">
        {PETS.map((p) => (
          <div className="pol rv" key={p.label}>
            <div className="im"><img src={p.src} alt="" /></div>
            <p>{p.label}</p>
          </div>
        ))}
        <a className="pol empty rv" href={`https://www.instagram.com/explore/tags/${SITE.hashtag}/`} target="_blank" rel="noopener noreferrer">
          <div className="im" aria-hidden="true">+</div>
          <p>Tag #{SITE.hashtag}</p>
        </a>
      </div>
    </section>
  );
}
