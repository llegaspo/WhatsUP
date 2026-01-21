import Icons from "./icons";

export interface EventCardProps {
  id?: string | number;
  imageSrc: string;
  date: string;
  org: string;
  orgLink?: string;
  title: string;
  description: string;
  link: string;
  onReadMore?: (event: EventCardProps) => void;
  onImageClick?: (imageSrc: string) => void;
  onRemove?: () => void;
  onEdit?: () => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
};

const getYear = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "" : date.getFullYear();
};

export default function EventCard(props: EventCardProps) {
  const {
    imageSrc,
    date,
    org,
    orgLink,
    title,
    description,
    link,
    onReadMore,
    onImageClick,
    onRemove,
    onEdit,
  } = props;
  const previewLength = 100;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-1">
      {(onRemove || onEdit) && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/90 backdrop-blur text-gray-600 rounded-full p-2 hover:bg-amber-50 hover:text-amber-600 shadow-sm border border-gray-200 transition-colors"
            >
              <Icons.Edit />
            </button>
          )}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="bg-white/90 backdrop-blur text-gray-600 rounded-full p-2 hover:bg-red-50 hover:text-red-600 shadow-sm border border-gray-200 transition-colors"
            >
              <Icons.Trash />
            </button>
          )}
        </div>
      )}

      <div
        className="relative aspect-video overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => onImageClick?.(imageSrc)}
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x200?text=Event";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden text-center min-w-[3.5rem]">
          <div className="bg-red-700 text-white text-[10px] uppercase font-bold py-0.5 px-2 tracking-wide">
            {getYear(date)}
          </div>
          <div className="px-2 py-1">
            <div className="text-sm font-bold text-gray-900 leading-tight">
              {formatDate(date).split(" ")[1]}
            </div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase">
              {formatDate(date).split(" ")[0]}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col relative">
        <div className="mb-3">
          {orgLink ? (
            <a
              href={orgLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] font-bold text-white uppercase tracking-wider bg-gradient-to-r from-red-800 to-red-600 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              {org}
            </a>
          ) : (
            <span className="inline-block text-[10px] font-bold text-white uppercase tracking-wider bg-gradient-to-r from-red-800 to-red-600 px-3 py-1 rounded-full shadow-sm">
              {org}
            </span>
          )}
        </div>

        <h3 className="text-lg font-extrabold text-gray-800 mb-2 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>

        <p className="text-sm text-gray-600 flex-grow leading-relaxed mb-4 line-clamp-3">
          {description.length > previewLength
            ? `${description.substring(0, previewLength)}...`
            : description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-200">
          <button
            onClick={() => onReadMore?.(props)}
            className="text-xs font-bold text-gray-500 hover:text-red-700 flex items-center group/btn uppercase tracking-wide transition-colors"
          >
            Read More
            <span className="ml-1 bg-gray-100 rounded-full p-1 group-hover/btn:bg-red-50 group-hover/btn:translate-x-1 transition-all">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="External Link"
            >
              <Icons.External />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
